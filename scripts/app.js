"use strict";

var App = (function() {
  
  function App() {
    this._updateTimer = undefined;
    this._running = false;
    this._game = undefined;
    this._view = undefined;
  };
  
  
  App.prototype._bindUiActions = function() {
    var self = this;
    
    this._view = $('#view').get(0);
    $('.button-start').show();
    $('.button-stop').hide();
    
    $('.button-reset').click(function() { self._reset(); });
    $('.button-start').click(function() { self._start(); });
    $('.button-stop').click(function() { self._stop(); });
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
      this._updateTimer = setInterval(function() { self._update(); }, 10);
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
  
  
  
  
  
  App.prototype.run = function() {
    this._bindUiActions();
    this._reset();
  }
  
  
  return App;
} ());

