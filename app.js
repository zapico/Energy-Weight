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
data[25] = {"id":25,"name":"coffee","weight":25,"energy":10,"text":""}
data[48] = {"id":48,"name":"lightbulb","weight":48,"energy":20,"text":""}
data[43] = {"id":43,"name":"fridge","weight":43,"energy":30,"text":""}
data[10] = {"id":10,"name":"mobil","weight":10,"energy":40,"text":""}
data[19] = {"id":19,"name":"computer","weight":19,"energy":50,"text":""}
data[23] = {"id":23,"name":"bike","weight":23,"energy":60,"text":""}
data[46] = {"id":46,"name":"car","weight":46,"energy":70,"text":""}

// 1 Initialize energy use
// A. Example of a house
// B. Example of an apartment
// C. Enter your own consumption
var energy = 2400
var totalweight = 0
io.emit('kwh', energy);
var control = [0,0,0,0,0,0];
var i = 0

// 2. If scale detects changes
var weight = scale.getWeight(function(weight){
	if (weight == 0){
		totalweight=0
	}
  // A.  Make sure value is stable
 	
  if ((weight - totalweight > 8) || (weight - totalweight < -8)){
	  if (i!=6){
	  	control[i] = weight
		  i += 1
		  console.log(control)
	  } else {
		  if (weight = control[5]){
		 	// B. Compare with previous value to infer block
  			var diff = weight - totalweight
  			console.log("total weight")
   		    console.log(totalweight)
		    console.log("weight now")
	        console.log(weight)
	        console.log("difference" )
	        console.log(diff)
			 
		  	// C. Get block from array with such weight and get its energy value
  			// Id of the block is its weight
			if (diff < 0){
  			  	id = -diff
  			  }else{
  			  	id = diff
  			  }
			 j=0
			 // Check array with a +-1 to allow for errors 
			 id += 1
			 while (typeof data[id] === 'undefined'){
				j += 1
				id -= 1
				if (j == 3){ break; // breaks out of loop completely}
			 }
			console.log(data[id])

			var blockenergy = data[id].energy
			// D. Add or deduct energy value from total
			if (diff > 0){
				// if the block was added, remove the equivalent saving from energy consumption
			  	energy -= blockenergy
			  }else{
				 // if the block was removed, add back the energy consumption
			  	energy += blockenergy
			  }
		  	// E. Send changes to UI
		  	io.emit('kwh', energy);
			io.emit('name', data[id].name);
			// Reinitialize
			i = 0
			totalweight = weight
		  }else{
		    i = 0
	  	  }   
 		} 
   	  }
});

