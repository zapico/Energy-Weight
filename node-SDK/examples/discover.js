// discover.js
var SituScale = require('../index.js');

var scale = new SituScale();
scale.searchScales(function(scale) {
  // Callback run for every new scale discovered in the vicinity till stopSearching is called()
  console.log("Discovered SITU scale with address: " + scale.address);
});

