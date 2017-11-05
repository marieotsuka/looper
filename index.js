var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var count = 0;
var timer = 0;
var track = 0;
var loopCount = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
    if(count==0){
		timer = 0; //reset timer
    }
	console.log('a user connected '+ count);
	sendTime();
	console.log(timer);
	track = count;
	console.log(track);
	io.emit('connected', ++count, timer, loopCount);

	socket.on('disconnect', function(){
	    console.log('user disconnected '+ count);
	    io.emit('disconnected', --count);

  	});
});




http.listen(3000, function(){
  console.log('listening on *:3000');
});

setInterval(function() {  
  timer++;
  sendTime();
}, 1000);

function sendTime(){
	io.sockets.emit('timer', { timer: timer });
}
