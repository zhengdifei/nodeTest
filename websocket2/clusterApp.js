var app = require('express')();
var http = require('http');
var sio = require('socket.io');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
	  console.log('worker ' + worker.process.pid + ' died');
  });
} else {
	var server = http.Server(app);
	
	server.listen(3000, function(){
		  console.log('listening on *:3000');
	});
	var io = sio(server);
	
	app.get('/', function(req, res){
		res.sendfile('public/chat.html');
	});

	io.on('connection', function(socket){
		  socket.on('chat message', function(msg){
		    console.log('message: ' + msg);
		    socket.emit('message','zdf:' + msg);
		  });
	});
}

