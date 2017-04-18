"use strict";

var Wator = (function() {
  
  //! Animal types.
  var TYPE = {
    NONE:      0,
    PREY:       1,
    PREDATOR:   2
  };
  
  //! Neighbourhood used.
  var neighbourhood = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
  
  
  /**
   * @brief Animal struct constructor.
   */
  function Animal(type, age, starvation, moved) {
    this.type = type;             // tracks the type of the cell
    this.age = age;                 // tracks the age for reproduction purposes
    this.starvation = starvation;   // tracks the starvation for predators
    this.moved = moved;             // tracks the movement
  }
    
  
  /**
   * @brief Wa-Tor class constructor.
   */
  function Wator(width, height) {
    this._width = width;
    this._height = height;
    this._data = new Array2(this._width, this._height, new Animal(TYPE.NONE, 0, 0, false));     
    
    this._preyReproductionAge = 50;
    this._predatorReproductionAge = 110;
    this._predatorStarvationAge = 100;
    this._ageVariance = 0.1;
    
    this._chronons = 0;
    this._preyCount = 0;
    this._predatorCount = 0;
    this._totalPreyCount = 0;
    this._totalPredatorCount = 0;
  }
  
  
  Wator.prototype.getChronons = function() { return this._chronons; }
  Wator.prototype.getPreyCount = function() { return this._preyCount; }
  Wator.prototype.getPredatorCount = function() { return this._predatorCount; }
  Wator.prototype.getTotalPreyCount = function() { return this._totalPreyCount; }
  Wator.prototype.getTotalPredatorCount = function() { return this._totalPredatorCount; }
  Wator.prototype.setPreyReproductionAge = function(age) { this._preyReproductionAge = age; }
  Wator.prototype.setPredatorReproductionAge = function(age) { this._predatorReproductionAge = age; }
  Wator.prototype.setPredatorStarvationAge = function(age) { this._predatorStarvationAge = age; }
  Wator.prototype.setAgeVariance = function(age) { this._ageVariance = age; }
  
  
  /**
   * @brief Initializes the game board with the nprey and npredators.
   */
  Wator.prototype.initialize = function(nprey, npredator) {
    /* clear previous counts */
    this._chronons = 0;
    this._preyCount = 0;
    this._predatorCount = 0;
    this._totalPreyCount = 0;
    this._totalPredatorCount = 0;
    
    /* take care of max. number of prey & predators*/
    var ncells = this._width * this._height;
    if (nprey > ncells) nprey = ncells;
    if (npredator > ncells - nprey) npredators = ncells - nprey;
    
    /* place prey */
    for (var i = 0; i < nprey;) {
      var x = Math.floor(this._width * Math.random());
      var y = Math.floor(this._height * Math.random());
      
      if (this._data.get(x, y).type == TYPE.NONE) {
        this._data.set(x, y, new Animal(TYPE.PREY, Math.floor(this._preyReproductionAge * Math.random()), 0, false));
        ++i;
        ++this._preyCount;
        ++this._totalPreyCount;
      }
    }
    
    /* place predators */
    for (var i = 0; i < npredator;) {
      var x = Math.floor(this._width * Math.random());
      var y = Math.floor(this._height * Math.random());
      
      if (this._data.get(x, y).type == TYPE.NONE) {
        this._data.set(x, y, new Animal(TYPE.PREDATOR, Math.floor(this._predatorReproductionAge * Math.random()), 0, false));
        ++i;
        ++this._predatorCount;
        ++this._totalPredatorCount;
      }
    }
  }
  
  
  /**
   * @brief Returns an array of empty adjacent cells.
   */
  Wator.prototype.getAdjacentEmptySquares = function(x, y) {
    var cells = [];
    for (var i = 0; i < neighbourhood.length; ++i) {
      var nx = (this._width + x + neighbourhood[i][0]) % this._width;
      var ny = (this._height + y + neighbourhood[i][1]) % this._height;
      
      if (this._data.get(nx, ny).type == TYPE.NONE) {
        cells.push({ x: nx, y: ny });
      }
    }
    
    return cells;
  }
  
  
  /**
   * @brief Returns an array of prey adjacent cells.
   */
  Wator.prototype._getAdjacentPreyAnimals = function(x, y) {
    var cells = [];
    for (var i = 0; i < neighbourhood.length; ++i) {
      var nx = (this._width + x + neighbourhood[i][0]) % this._width;
      var ny = (this._height + y + neighbourhood[i][1]) % this._height;
      
      if (this._data.get(nx, ny).type == TYPE.PREY) {
        cells.push({ x: nx, y: ny });
      }
    }
    
    return cells;
  }
  
  
  /**
   * @brief Creates a new animal.
   * The new animal has 0 starvation and age randomized within the bounds of the AgeVariance.
   */
  Wator.prototype._makeAnimal = function(type) {
    var age_offset = 0;
    if (type == TYPE.PREY) age_offset = Math.floor(this._ageVariance*this._preyReproductionAge*(2*Math.random()-1));
    if (type == TYPE.PREDATOR) age_offset = Math.floor(this._ageVariance*this._preyReproductionAge*(2*Math.random()-1));
    
    return new Animal(type, age_offset, 0, false);
  }
  
  
  /**
   * @brief Places animal at (i, j) coordinates.
   */
  Wator.prototype._placeAnimal = function(i, j, animal) {
    this._data.set(i, j, animal);
  }
  
  
  /**
   * @brief Updates the game to the next state.
   * Performs the following:
   * 1. Clear 'moved' flags,
   * 2. Move & breed predators,
   * 3. Move and breed prey.
   */
  Wator.prototype.update = function() {
    /* clear moved flags */
    this._data.apply(function(i, j, x) { x.moved = false; return x; });
    
    /* move and breed predators */
    for (var i = 0; i < this._width; ++i) {
      for (var j = 0; j < this._height; ++j) {
        var animal = this._data.get(i, j);
        
        if (animal.type == TYPE.PREDATOR && !animal.moved) {
          if (animal.moved) {
            animal.moved = false;
            continue;
          }
          
          /* update predator */
          ++animal.age;
          ++animal.starvation;
          animal.moved = true;
          if (animal.starvation > this._predatorStarvationAge) {
            this._placeAnimal(i, j, this._makeAnimal(TYPE.NONE)); // RIP ;(
            --this._predatorCount;
            continue;
          }
          
          /* shall it catch prey OR move? */
          var target = undefined;
          var targets = this.getAdjacentEmptySquares(i, j);
          if (targets.length != 0) {
            target = targets[Math.floor(targets.length * Math.random())];
          }
          targets = this._getAdjacentPreyAnimals(i, j); // this overwrites previous targets generated
          if (targets.length != 0) {
            target = targets[Math.floor(targets.length * Math.random())];
            animal.starvation = 0;
            --this._preyCount;
          }
          if (target === undefined) continue;

          /* shall it breed? */
          if (animal.age >= this._predatorReproductionAge) {
            animal.age = 0;
             this._placeAnimal(i, j, this._makeAnimal(TYPE.PREDATOR));
             ++this._predatorCount;
             ++this._totalPredatorCount;
          } else {
            this._placeAnimal(i, j, this._makeAnimal(TYPE.NONE));
          }
          
          /* place new animal */
          this._placeAnimal(target.x, target.y, animal);
        }
      }
    }
    
    /* move and breed prey */
    for (var i = 0; i < this._width; ++i) {
      for (var j = 0; j < this._height; ++j) {
        var animal = this._data.get(i, j);
        
        if (animal.type == TYPE.PREY && !animal.moved) {
          if (animal.moved) {
            animal.moved = false;
            continue;
          }
          
          /* update prey */
          ++animal.age;
          animal.moved = true;
          
          /* shall it move? */
          var targets = this.getAdjacentEmptySquares(i, j);
          if (targets.length == 0) continue;
          var target = targets[Math.floor(targets.length * Math.random())];

          /* shall it breed? */
          if (animal.age >= this._preyReproductionAge) {
            animal.age = 0;
             this._placeAnimal(i, j, this._makeAnimal(TYPE.PREY));
             ++this._preyCount;
             ++this._totalPreyCount;
          } else {
            this._placeAnimal(i, j, this._makeAnimal(TYPE.NONE));
          }

          /* place old animal */
          this._placeAnimal(target.x, target.y, animal);
        }
      }
    }
    
  }
  
  
  /**
   * @brief Renders the Wa-Tor game state onto a canvas.
   */
  Wator.prototype.render = function(canvas) {
    var ctx = canvas.getContext('2d');
    
    var dx = canvas.width / this._width;
    var dy = canvas.height / this._height;
    
    for (var i = 0; i < this._width; ++i) {
      for (var j = 0; j < this._height; ++j) {
        var type = this._data.get(i, j).type;
        
        if (type == TYPE.NONE) {
          ctx.fillStyle = 'black';
        } else if (type == TYPE.PREY) {
          ctx.fillStyle = 'blue';
        } else if (type == TYPE.PREDATOR) {
          ctx.fillStyle = 'red';
        }
        
        ctx.fillRect(i*dx, j*dy, dx, dy);
      }
    }
  }
  
  
  return Wator;
} ());

