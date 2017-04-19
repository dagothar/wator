"use strict";

var App = (function() {
  
  function App() {
    this._updateTimer = undefined;
    this._running = false;
    this._game = undefined;
    this._view = undefined;
    this._chartView = undefined;
    this._chart = undefined;
    this._speed = 100;
  };
  
  
  App.prototype._bindUiActions = function() {
    var self = this;
    
    this._view = $('#view').get(0);
    this._chartView = $('#chart').get(0);
    $('.button-start').show();
    $('.button-stop').hide();
    $('.slider-speed').val(0);
    $('.parameter-initial-prey').val(100);
    $('.parameter-initial-predators').val(100);
    $('.parameter-prey-reproduction').val(100);
    $('.parameter-predator-reproduction').val(100);
    $('.parameter-predator-starvation').val(50);
    
    $('.button-reset').click(function() { self._reset(); });
    $('.button-start').click(function() { self._start(); });
    $('.button-stop').click(function() { self._stop(); });
    $('.slider-speed').on('input change', function() { self._changeSpeed($(this).val()); });
  }
  
  
  App.prototype._updateUi = function() {
    var chronons = this._game.getChronons();
    var prey = this._game.getPreyCount();
    var totalPrey = this._game.getTotalPreyCount();
    var predators = this._game.getPredatorCount();
    
    $('.chronons').text(chronons);
    $('.prey-count').text(prey);
    $('.predator-count').text(predators);
    $('.kill-count').text(totalPrey - prey);
  }
  
  
  App.prototype._reset = function() {
    var initialPrey = $('.parameter-initial-prey').val();
    var initialPredators = $('.parameter-initial-predators').val();
    var preyReproductionAge = $('.parameter-prey-reproduction').val();
    var predatorReproductionAge = $('.parameter-predator-reproduction').val();
    var predatorStarvationAge = $('.parameter-predator-starvation').val();
    
    this._stop();
    this._game = new Wator(100, 100);
    this._game.initialize(initialPrey, initialPredators);
    this._game.setPreyReproductionAge(preyReproductionAge);
    this._game.setPredatorReproductionAge(predatorReproductionAge);
    this._game.setPredatorStarvationAge(predatorStarvationAge);
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

