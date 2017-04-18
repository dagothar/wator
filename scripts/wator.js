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
   * @brief Updates the game to the next state.
   * Performs the following:
   * 1. Fish move & breed,
   * 2. Shark move & breed.
   */
  Wator.prototype.update = function() {
    
  }
  
  
  /**
   * @brief Renders the Wa-Tor game state onto a context.
   */
  Wator.prototype.render = function(context) {
    
  }
  
  
  return Wator;
} ());

