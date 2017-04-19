"use strict";

var Wator = (function() {
  
  //! Animal types.
  var TYPE = {
    NONE:       0,
    PREY:       1,
    PREDATOR:   2
  };
  
  //! Neumann neighbourhood.
  var NEUMANN = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];
  
  //! Moore neighbourhood.
  var MOORE = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];
  
  
  /**
   * @brief Animal struct constructor.
   */
  function Animal(x, y, type, age, starvation, moved) {
    this.x          = x;
    this.y          = y;
    this.type       = type;         // tracks the type of the cell
    this.age        = age;          // tracks the age for reproduction purposes
    this.starvation = starvation;   // tracks the starvation for predators
    this.moved      = moved;        // tracks the movement
  }
  
  
  /**
   * Shuffles array in place.
   * @param {Array} a items The array containing the items.
   */
  function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  }
    
  
  /**
   * @brief Wa-Tor class constructor.
   */
  function Wator(width, height) {
    this._width = width;
    this._height = height;
    this._data = new Array2(this._width, this._height, new Animal(0, 0, TYPE.NONE, 0, 0, false));   
    this._prey = [];
    this._predators = [];  
    
    this._preyReproductionAge     = 1000;
    this._predatorReproductionAge = 110;
    this._predatorStarvationAge   = 100;
    this._ageVariance             = 0.1;
    this._neighbourhood           = NEUMANN;
    
    this._chronons                = 0;
    this._preyCount               = 0;
    this._predatorCount           = 0;
    this._totalPreyCount          = 0;
    this._totalPredatorCount      = 0;
    this._score                   = 0;
  }
  
  
  Wator.prototype.getChronons                 = function() { return this._chronons; }
  Wator.prototype.getPreyCount                = function() { return this._preyCount; }
  Wator.prototype.getPredatorCount            = function() { return this._predatorCount; }
  Wator.prototype.getTotalPreyCount           = function() { return this._totalPreyCount; }
  Wator.prototype.getTotalPredatorCount       = function() { return this._totalPredatorCount; }
  Wator.prototype.getScore                    = function() { return this._score; }
  Wator.prototype.setPreyReproductionAge      = function(age) { this._preyReproductionAge = age; }
  Wator.prototype.setPredatorReproductionAge  = function(age) { this._predatorReproductionAge = age; }
  Wator.prototype.setPredatorStarvationAge    = function(age) { this._predatorStarvationAge = age; }
  Wator.prototype.setAgeVariance              = function(age) { this._ageVariance = age; }
  
  Wator.prototype.setNeighbourhood            = function(neighbourhood) {
    switch(neighbourhood) {
      case 'moore':
        this._neighbourhood = MOORE;
        console.log('!');
        break;
        
      default:
      case 'neumann':
        this._neighbourhood = NEUMANN;
        break;
    }
  }
  
  
  /**
   * @brief Creates a new animal.
   * The new animal has 0 starvation and age randomized within the bounds of the variance.
   */
  Wator.prototype._makeAnimal = function(x, y, type, variance) {
    var age_offset = 0;
    var starvation_offset = 0;
    
    if (type == TYPE.PREY) {
      age_offset = Math.floor(variance*this._preyReproductionAge*(2*Math.random()-1));
    } else if (type == TYPE.PREDATOR) {
      age_offset = Math.floor(variance*this._predatorReproductionAge*(2*Math.random()-1));
      starvation_offset = Math.floor(variance*this._predatorStarvationAge*(2*Math.random()-1));
    }
    
    return new Animal(x, y, type, age_offset, starvation_offset, false);
  }
  
  
  /**
   * @brief Initializes the game board with the nprey and npredators.
   */
  Wator.prototype.initialize = function(nprey, npredator) {
    /* clear data */
    this._data = new Array2(this._width, this._height, new Animal(0, 0, TYPE.NONE, 0, 0, false));   
    this._prey = [];
    this._predators = [];  
    
    /* clear previous counts */
    this._chronons = 0;
    this._preyCount = 0;
    this._predatorCount = 0;
    this._totalPreyCount = 0;
    this._totalPredatorCount = 0;
    this._score = 0;
    
    /* take care of max. number of prey & predators*/
    var ncells = this._width * this._height;
    if (nprey > ncells) nprey = ncells;
    if (npredator > ncells - nprey) npredators = ncells - nprey;
    
    /* place prey */
    for (var i = 0; i < nprey;) {
      var x = Math.floor(this._width * Math.random());
      var y = Math.floor(this._height * Math.random());
      
      if (this._data.get(x, y).type == TYPE.NONE) {
        var new_prey = this._makeAnimal(x, y, TYPE.PREY, 1.0);
        this._data.set(x, y, new_prey);
        this._prey.push(new_prey);
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
        var new_predator = this._makeAnimal(x, y, TYPE.PREDATOR, 1.0);
        this._data.set(x, y, new_predator);
        this._predators.push(new_predator);
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
    for (var i = 0; i < this._neighbourhood.length; ++i) {
      var nx = (this._width + x + this._neighbourhood[i][0]) % this._width;
      var ny = (this._height + y + this._neighbourhood[i][1]) % this._height;
      
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
    for (var i = 0; i < this._neighbourhood.length; ++i) {
      var nx = (this._width + x + this._neighbourhood[i][0]) % this._width;
      var ny = (this._height + y + this._neighbourhood[i][1]) % this._height;
      
      if (this._data.get(nx, ny).type == TYPE.PREY) {
        cells.push({ x: nx, y: ny });
      }
    }
    
    return cells;
  }
  
  
  /**
   * @brief Places animal at (i, j) coordinates.
   */
  Wator.prototype._placeAnimal = function(i, j, animal, canvas) {
    this._data.set(i, j, animal);
    
    if (canvas) {
      var ctx = canvas.getContext('2d');
    
      var dx = canvas.width / this._width;
      var dy = canvas.height / this._height;
      
      var type = animal.type;
        
      if (type == TYPE.NONE) {
        ctx.fillStyle = 'black';
      } else if (type == TYPE.PREY) {
        ctx.fillStyle = 'blue';
      } else if (type == TYPE.PREDATOR) {
        ctx.fillStyle = 'red';
      }
      
      ctx.fillRect(animal.x*dx, animal.y*dy, dx, dy);
    }
  }
  
  
  /**
   * @brief Updates the game to the next state.
   * Performs the following:
   * 1. Clear 'moved' flags,
   * 2. Move & breed predators,
   * 3. Move and breed prey.
   */
  Wator.prototype.update = function(canvas) {
    ++this._chronons;
    if (this._predatorCount > 0) ++this._score;
    
    /* clear moved flags */
    this._data.apply(function(i, j, x) { x.moved = false; return x; });
    
    /* move and breed predators */
    var npredators = [];
    shuffle(this._predators);
    for (var i = 0; i < this._predators.length; ++i) {
      var animal = this._predators[i];
      
      if (animal.type == TYPE.PREDATOR && !animal.moved) {
        if (animal.moved) {
          animal.moved = false;
          continue;
        }
        
        var x = animal.x;
        var y = animal.y;
        
        /* update predator */
        ++animal.age;
        ++animal.starvation;
        animal.moved = true;
        if (animal.starvation > this._predatorStarvationAge) {
          this._placeAnimal(x, y, this._makeAnimal(x, y, TYPE.NONE, 0), canvas); // RIP ;(
          --this._predatorCount;
          continue;
        }
        
        /* shall it catch prey OR move? */
        var target = undefined;
        var targets = this.getAdjacentEmptySquares(x, y);
        if (targets.length != 0) {
          target = targets[Math.floor(targets.length * Math.random())];
        }
        targets = this._getAdjacentPreyAnimals(x, y); // this overwrites previous targets generated
        if (targets.length != 0) {
          target = targets[Math.floor(targets.length * Math.random())];
          animal.starvation = 0;
          --this._preyCount;
          this._data.get(target.x, target.y).type = TYPE.NONE;
        }
        if (target === undefined) {
          npredators.push(animal);
          continue;
        }

        /* shall it breed? */
        if (animal.age >= this._predatorReproductionAge) {
          animal.age = 0;
          var offspring = this._makeAnimal(x, y, TYPE.PREDATOR, this._ageVariance);
          this._placeAnimal(x, y, offspring, canvas);
          npredators.push(offspring);
          ++this._predatorCount;
          ++this._totalPredatorCount;
        } else {
          this._placeAnimal(x, y, this._makeAnimal(x, y, TYPE.NONE, 0), canvas);
        }
        
        /* place animal at target pos. */
        animal.x = target.x;
        animal.y = target.y;
        this._placeAnimal(target.x, target.y, animal, canvas);
        npredators.push(animal);
      }
    }
    this._predators = npredators;
    
    /* move and breed prey */
    var nprey = [];
    shuffle(this._prey);
    for (var i = 0; i < this._prey.length; ++i) {
      var animal = this._prey[i];
      
      if (animal.type == TYPE.PREY && !animal.moved) {
        if (animal.moved) {
          animal.moved = false;
          continue;
        }
        
        var x = animal.x;
        var y = animal.y;
        
        /* update prey */
        ++animal.age;
        animal.moved = true;
        
        /* shall it move? */
        var targets = this.getAdjacentEmptySquares(x, y);
        if (targets.length == 0) {
          nprey.push(animal);
          continue;
        }
        var target = targets[Math.floor(targets.length * Math.random())];

        /* shall it breed? */
        if (animal.age >= this._preyReproductionAge) {
          animal.age = 0;
          var offspring = this._makeAnimal(x, y, TYPE.PREY, this._ageVariance);
           this._placeAnimal(x, y, offspring, canvas);
           nprey.push(offspring);
           ++this._preyCount;
           ++this._totalPreyCount;
        } else {
          this._placeAnimal(x, y, this._makeAnimal(x, y, TYPE.NONE, 0), canvas);
        }

        /* place animal at target pos. */
        animal.x = target.x;
        animal.y = target.y;
        this._placeAnimal(target.x, target.y, animal, canvas);
        nprey.push(animal);
      }
    }
    this._prey = nprey;
    
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

