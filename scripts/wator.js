"use strict";

var Wator = (function() {
  
  //! Cell states.
  var STATE = {
    EMPTY:      0,
    PREY:       1,
    PREDATOR:   2
  };
  
  //! Neighbourhood used.
  var neighbourhood = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
  
  
  /**
   * @brief Cell struct constructor.
   */
  function Cell(state, age, starvation, moved) {
    this.state = state;             // tracks the type of the cell
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
    this._data = new Array2(this._width, this._height, new Cell(STATE.EMPTY, 0, 0, false));     
    
    this._preyReproductionAge = 100;
    this._predatorReproductionAge = 20;
    this._preyFoodValue = 10;
    this._predatorStarvationAge = 10;
  }
  
  
  /**
   * @brief Initializes the game board with the nprey and npredators.
   */
  Wator.prototype.initialize = function(nprey, npredator) {
    /* take care of max. number of prey & predators*/
    var ncells = this._width * this._height;
    if (nprey > ncells) nprey = ncells;
    if (npredator > ncells - nprey) npredators = ncells - nprey;
    
    /* place prey */
    for (var i = 0; i < nprey;) {
      var x = Math.round((this._width-1) * Math.random());
      var y = Math.round((this._height-1) * Math.random());
      
      if (this._data.get(x, y).state == STATE.EMPTY) {
        this._data.set(x, y, new Cell(STATE.PREY, Math.floor(this._preyReproductionAge * Math.random()), 0, false));
        ++i;
      }
    }
    
    /* place predators */
    for (var i = 0; i < npredator;) {
      var x = Math.round((this._width-1) * Math.random());
      var y = Math.round((this._height-1) * Math.random());
      
      if (this._data.get(x, y).state == STATE.EMPTY) {
        this._data.set(x, y, new Cell(STATE.PREDATOR, Math.floor(this._predatorReproductionAge * Math.random()), 0, false));
        ++i;
      }
    }
  }
  
  
  /**
   * @brief Returns an array of empty adjacent cells.
   */
  Wator.prototype._getAdjacentEmptyCells = function(x, y) {
    var cells = [];
    for (var i = 0; i < neighbourhood.length; ++i) {
      var nx = (this._width + x + neighbourhood[i][0]) % this._width;
      var ny = (this._height + y + neighbourhood[i][1]) % this._height;
      if (this._data.get(nx, ny).state == STATE.EMPTY) {
        cells.push({ x: nx, y: ny });
      }
    }
    
    return cells;
  }
  
  
  /**
   * @brief Returns an array of prey adjacent cells.
   */
  Wator.prototype._getAdjacentPreyCells = function(x, y) {
    var cells = [];
    for (var i = 0; i < neighbourhood.length; ++i) {
      var nx = (this._width + x + neighbourhood[i][0]) % this._width;
      var ny = (this._height + y + neighbourhood[i][1]) % this._height;
      if (this._data.get(nx, ny).state == STATE.PREY) {
        cells.push({ x: nx, y: ny });
      }
    }
    
    return cells;
  }
  
  
  /**
   * @brief Updates the game to the next state.
   * Performs the following:
   * 1. Fish move & breed,
   * 2. Shark move & breed.
   */
  Wator.prototype.update = function() {
    /* clear moved flags */
    this._data.apply(function(i, j, x) { x.moved = false; return x; });
    
    /* move and breed predators */
    for (var i = 0; i < this._width; ++i) {
      for (var j = 0; j < this._height; ++j) {
        var cell = this._data.get(i, j);
        
        if (cell.state == STATE.PREDATOR && !cell.moved) {
          if (cell.moved) {
            cell.moved = false;
            continue;
          }
          
          /* update predator */
          ++cell.age;
          ++cell.starvation;
          cell.moved = true;
          if (cell.starvation > this._predatorStarvationAge) {
            this._data.set(i, j, new Cell(STATE.EMPTY, 0, 0, true));
            continue;
          }
          
          /* shall it catch prey OR move? */
          var target = undefined;
          var targets = this._getAdjacentEmptyCells(i, j);
          if (targets.length != 0) {
            target = targets[Math.round((targets.length-1) * Math.random())];
          }
          targets = this._getAdjacentPreyCells(i, j);
          if (targets.length != 0) {
            target = targets[Math.round((targets.length-1) * Math.random())];
            cell.starvation -= this._preyFoodValue;
          }
          if (target === undefined) continue;

          /* shall it breed? */
          if (cell.age >= this._predatorReproductionAge) {
            cell.age = 0;
             this._data.set(i, j, new Cell(STATE.PREDATOR, 0, 0, true));
          } else {
            this._data.set(i, j, new Cell(STATE.EMPTY, 0, 0, true));
          }
          
          /* place new cell */
          this._data.set(target.x, target.y, cell);
        }
      }
    }
    
    /* move and breed prey */
    for (var i = 0; i < this._width; ++i) {
      for (var j = 0; j < this._height; ++j) {
        var cell = this._data.get(i, j);
        
        if (cell.state == STATE.PREY && !cell.moved) {
          if (cell.moved) {
            cell.moved = false;
            continue;
          }
          
          /* update prey */
          ++cell.age;
          cell.moved = true;
          
          /* shall it move? */
          var targets = this._getAdjacentEmptyCells(i, j);
          if (targets.length == 0) continue;
          var target = targets[Math.round((targets.length-1) * Math.random())];

          /* shall it breed? */
          if (cell.age >= this._preyReproductionAge) {
            cell.age = 0;
             this._data.set(i, j, new Cell(STATE.PREY, 0, 0, true));
          } else {
            this._data.set(i, j, new Cell(STATE.EMPTY, 0, 0, true));
          }

          /* place new cell */
          this._data.set(target.x, target.y, cell);
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
        var state = this._data.get(i, j).state;
        
        if (state == STATE.EMPTY) {
          ctx.fillStyle = 'black';
        } else if (state == STATE.PREY) {
          ctx.fillStyle = 'blue';
        } else if (state == STATE.PREDATOR) {
          ctx.fillStyle = 'red';
        }
        
        ctx.fillRect(i*dx, j*dy, dx, dy);
      }
    }
  }
  
  
  return Wator;
} ());

