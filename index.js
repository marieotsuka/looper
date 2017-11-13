var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var count = 0;
var timer = 0;
var users = [];
var pos = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
    if(users.length==0){
		timer = 0; //reset timer 
    }

    users.push(socket.id); //add to array list of users
    count = users.length;

    console.log(users);
    
	sendTime(); //timer

	// just to client
	socket.emit('newUser', count);
	
	// all clients
	io.emit('connected', count, socket.id);
	

	// all clients except new client
	socket.broadcast.emit('join',count-1);
	
	socket.on('disconnect', function(){
		// remove user from array
		var index = users.indexOf(socket.id);
		if (index > -1) {
		    users.splice(index, 1);
		}
		console.log(users);
	    io.emit('disconnected', --count);
  	});
});


http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});

setInterval(function() {  
  timer++;
  sendTime();
}, 1000);

function sendTime(){
	io.emit('timer', { timer: timer });
}
