"use strict";

var App = (function() {
  
  function App() {
    this._updateTimer   = undefined;
    this._running       = false;
    this._game          = undefined;
    this._view          = undefined;
    this._chart         = undefined;
    this._preyData      = [];
    this._predatorData  = [];
    this._speed         = 100;
  };
  
  
  App.prototype._bindUiActions = function() {
    var self = this;
    
    this._view = $('#view').get(0);
    
    $('.button-start').show();
    $('.button-stop').hide();
    $('.slider-speed').val(0);
    $('.parameter-width').val(160);
    $('.parameter-height').val(120);
    $('.parameter-initial-prey').val(5000);
    $('.parameter-initial-predators').val(1000);
    $('.parameter-prey-reproduction').val(10);
    $('.parameter-predator-reproduction').val(25);
    $('.parameter-predator-starvation').val(10);
    $('.slider-variance').val(50);
    $('#neighbourhood').val('neumann');
    
    $('.button-reset').click(function() { self._reset(); });
    $('.button-start').click(function() { self._start(); });
    $('.button-stop').click(function() { self._stop(); });
    $('.slider-speed').on('input change', function() { self._changeSpeed($(this).val()); });
  }
  
  
  App.prototype._updateChart = function() {
    var chronons  = this._game.getChronons();
    var prey      = this._game.getPreyCount();
    var predators = this._game.getPredatorCount();
    
    this._preyData.push({x: chronons, y: prey});
    this._predatorData.push({x: chronons, y: predators});
    if (this._preyData.length > 500) this._preyData.shift();
    if (this._predatorData.length > 500) this._predatorData.shift();
    
    var min = this._preyData[0].x;
    var max = this._preyData.slice(-1)[0].x;
    
    if (! (chronons % 10)) {
      if (this._chart) this._chart.destroy();
      this._chart = new Chart(
        'chart',
        {
          type: 'line',
          data: {
            datasets: [
              { label: 'prey', yAxisID: 'A', data: this._preyData, borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.3)', pointRadius: 0 },
              { label: 'predators', yAxisID: 'B', data: this._predatorData, borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.3)', pointRadius: 0 }
            ]
          },
          options: {
            animation: false,
            scales: {
              xAxes: [{ type: 'linear', position: 'bottom', ticks: { min: min, max: max } }],
              yAxes: [
                { id: 'A', type: 'linear', position: 'left' },
                { id: 'B', type: 'linear', position: 'right' },
              ]
            }
          }
        }
      );
    }
  }
  
  
  App.prototype._updateUi = function() {
    var chronons  = this._game.getChronons();
    var prey      = this._game.getPreyCount();
    var totalPrey = this._game.getTotalPreyCount();
    var predators = this._game.getPredatorCount();
    //var score     = this._game.getScore();
    
    $('.chronons').text(chronons);
    $('.prey-count').text(prey);
    $('.predator-count').text(predators);
    $('.kill-count').text(totalPrey - prey);
    $('.kill-count').text(totalPrey - prey);
    //$('.score').text(score);
    $('.speed').text((100.0/this._speed).toFixed(1) + 'x');
    
    this._updateChart();
  }
  
  
  App.prototype._reset = function() {
    var width                   = parseInt($('.parameter-width').val());
    var height                  = parseInt($('.parameter-height').val());
    var initialPrey             = parseInt($('.parameter-initial-prey').val());
    var initialPredators        = parseInt($('.parameter-initial-predators').val());
    var preyReproductionAge     = parseInt($('.parameter-prey-reproduction').val());
    var predatorReproductionAge = parseInt($('.parameter-predator-reproduction').val());
    var predatorStarvationAge   = parseInt($('.parameter-predator-starvation').val());
    var ageVariance             = 0.01 * $('.slider-variance').val();
    var neighbourhood           = $('#neighbourhood').val();
    
    this._stop();
    this._game = new Wator(width, height);
    this._game.setPreyReproductionAge(preyReproductionAge);
    this._game.setPredatorReproductionAge(predatorReproductionAge);
    this._game.setPredatorStarvationAge(predatorStarvationAge);
    this._game.setAgeVariance(ageVariance);
    this._game.setNeighbourhood(neighbourhood);
    this._game.initialize(initialPrey, initialPredators);
    this._game.render(this._view);
    
    this._preyData = [];
    this._predatorData = [];
    
    this._updateUi();
  }
  
  
  App.prototype._update = function() {
    this._game.update(this._view);
    //this._game.render(this._view);
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
    this._updateUi();
  }
  
  
  
  
  
  App.prototype.run = function() {
    this._bindUiActions();
    this._reset();
  }
  
  
  return App;
} ());

