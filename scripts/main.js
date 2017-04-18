"use strict";

$(document).ready(function() {
  
  var view = $('#view').get(0);
  
  var wator = new Wator(10, 10);
  wator.initialize(10, 5);
  
  wator.render(view);

});
