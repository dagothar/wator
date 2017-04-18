"use strict";

var App = (function() {
  
  function App() {
    this._updateTimer = undefined;
    this._running = false;
    this._game = undefined;
    this._view = undefined;
    this._speed = 100;
  };
  
  
  App.prototype._bindUiActions = function() {
    var self = this;
    
    this._view = $('#view').get(0);
    $('.button-start').show();
    $('.button-stop').hide();
    $('.slider-speed').val(0);
    
    $('.button-reset').click(function() { self._reset(); });
    $('.button-start').click(function() { self._start(); });
    $('.button-stop').click(function() { self._stop(); });
    $('.slider-speed').on('input change', function() { self._changeSpeed($(this).val()); });
  }
  
  
  App.prototype._updateUi = function() {
    $('.prey-count').text(this._game.getPreyCount());
    $('.predator-count').text(this._game.getPredatorCount());
  }
  
  
  App.prototype._reset = function() {
    this._stop();
    this._game = new Wator(100, 100);
    this._game.initialize(1000, 10);
    this._game.render(this._view);
    this._updateUi();
  }
  
  
  App.prototype._update = function() {
    this._game.update();
    this._game.render(this._view);
    this._updateUi();
  }
  
  
  App.prototype._start = function() {
    if (!this._running) {
      $('.button-start').hide();
      $('.button-stop').show();
      
      this._running = true;
      var self = this;
      this._updateTimer = setInterval(function() { self._update(); }, this._speed);
    }
  }
  
  
  App.prototype._stop = function() {
    if (this._running) {
      $('.button-start').show();
      $('.button-stop').hide();
    
      this._running = false;
      clearInterval(this._updateTimer);
    }
  }
  
  
  App.prototype._changeSpeed = function(val) {
    this._speed = 100 * Math.pow(1.258925, -val);
    if (this._running) {
      clearInterval(this._updateTimer);
      var self = this;
      this._updateTimer = setInterval(function() { self._update(); }, this._speed);
    } 
  }
  
  
  
  
  
  App.prototype.run = function() {
    this._bindUiActions();
    this._reset();
  }
  
  
  return App;
} ());

