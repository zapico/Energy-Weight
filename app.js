// Energy weight
// Jorge Zapico
// http://zapi.co
// KTH Royal Institute of Technology. 

// 0 Init
// 0A Server
const express = require('express')
const app = express()
var http  = require('http').Server(app);
const io  = require("socket.io")(http);
const EventEmitter = require('events');
app.use(express.static('public'));
// 0B Situ
var SituScale = require('./node-SDK/index.js');
var address = "dd:21:dd:f3:23:74";
var scale = new SituScale(address);

// Start listening

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var sockets = {};
var id = 0;

io.on('connection', function(socket){
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

//Data, as an array, keeping it simple
var data = []
data[14] = {"name":"1 mil med elcykel","energy":30,"text":""}
data[22] = {"name":"belsyning","energy":160,"text":""}
data[33] = {"name":"tvätt","energy":60}
data[64] = {"name":"IT och underhåll","energy":125,"text":""}
data[98] = {"name":"kyl & frys","energy":160,"text":""}
data[138] = {"name":"1 mil med elbil","energy":730,"text":""}
data[152] = {"name":"1 mil med elbil","energy":730,"text":""}
data[155] = {"name":"1 mil med elbil","energy":730,"text":""}
data[160] = {"name":"1 mil med elbil","energy":730,"text":""}
data[276] = {"name":"En lägenhet","energy":6000,"text":""}
data[361] = {"name":"Ett hus","energy":12000,"text":""}

// 1 Initialize energy use
// A. Example of a house
// B. Example of an apartment
// C. Enter your own consumption
var used = 0
var totalweight = 0
var control = [0,0,0];
var i = 0

// 2. If scale detects changes
var weight = scale.getWeight(function(weight){
	if (weight == 0) {
		totalweight = 0
		used = 0
		io.emit('kwh', used)
	}
  // A.  Make sure value is stable
 	
  if ((weight - totalweight > 8) || (weight - totalweight < -8)){
	  
	  if (i!=3){
	  	control[i] = weight
		  i += 1
	  } else if (weight == control[0]) {
		  console.log(control)
		 	// B. Compare with previous value to infer block
  			var diff = weight - totalweight
		  	// C. Get block from array with such weight and get its energy value
  			// Id of the block is its weight
			if (diff < 0) {
  			  	id = -diff
  			 } else {
  			  	id = diff
  			 }
			 j = 0
			 // Check array with a +-3 to allow for errors 
			 id += 3
			 
			 while (typeof data[id] === 'undefined'){
				j += 1
				id -= 1
				if (j == 7){ 
					break;
				} // breaks out of loop completely}
			 }			
			 if (typeof data[id] != 'undefined'){
				 var blockenergy = data[id].energy
	 			// D. Add or deduct energy value from total
	 			if (diff > 0) {
	 				// if the block was added, remove the equivalent saving from energy consumption
	 			  	used += blockenergy
	 				io.emit('added', data[id].name, id)
	 			  } else {
	 				 // if the block was removed, add back the energy consumption
	 			  	used -= blockenergy
	 				io.emit('removed', data[id].name, id)
	 			  }
	 		  	// E. Send changes to UI
	 		  	io.emit('kwh', used)
	 			// Reinitialize
	 			i = 0
	 			totalweight = weight
				console.log(totalweight)
			 }else{
	 			i = 0
			 }
		  } else {
		    i = 0
	  	  }    
   	  }
});