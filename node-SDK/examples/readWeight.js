// readWeight.js
var SituScale = require('../index.js');

var address = "dd:21:dd:f3:23:74";
var scale = new SituScale(address);

var weight = scale.getWeight(function(weight){
  console.log(weight);
});
