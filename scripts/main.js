"use strict";

$(document).ready(function() {
  
  var view = $('#view').get(0);
  
  var wator = new Wator(100, 100);
  wator.initialize(100, 50);
  
  wator.render(view);
  
  function update() {
    wator.update();
    wator.render(view);
  }
  
  $('.button-start').click(function() {
    setInterval(update, 100);
  });

});
