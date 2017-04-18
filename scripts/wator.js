"use strict";

var Wator = (function() {
  
  var STATE = {
    EMPTY:      0,
    PREY:       1,
    PREDATOR:   2
  };
  
  /**
   * @brief Constructor.
   */
  function Wator(width, height) {
    this._width = width;
    this._height = height;
    this._data = new Array2(this._width, this._height, STATE.EMPTY);    
  }
  
  
  /**
   * @brief Initializes the game board with the nprey and npredators.
   */
  Wator.prototype.initialize = function(nprey, npredator) {
    /* take care of max. number of prey */
    var ncells = this._width * this._height;
    if (nprey > ncells) nprey = ncells;
    if (npredator > ncells - nprey) npredators = ncells - nprey;
    
    /* place prey */
    for (var i = 0; i < nprey;) {
      var x = Math.round((this._width-1) * Math.random());
      var y = Math.round((this._height-1) * Math.random());
      
      if (this._data.get(x, y) == STATE.EMPTY) {
        this._data.set(x, y, STATE.PREY);
        ++i;
      }
    }
    
    /* place predators */
    for (var i = 0; i < npredator;) {
      var x = Math.round((this._width-1) * Math.random());
      var y = Math.round((this._height-1) * Math.random());
      
      if (this._data.get(x, y) == STATE.EMPTY) {
        this._data.set(x, y, STATE.PREDATOR);
        ++i;
      }
    }
  }
  
  
  /**
   * @brief Updates the game to the next state.
   * Performs the following:
   * 1. Fish move & breed,
   * 2. Shark move & breed.
   */
  Wator.prototype.update = function() {
    
    for (var i = 0; i < this._width; ++i) {
      for (var j = 0; j < this._height; ++j) {
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
        var state = this._data.get(i, j);
        
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

