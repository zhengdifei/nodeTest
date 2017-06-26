var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	sio = require('socket.io'),
	cluster = require('cluster'),
	net = require('net'),
	redis = require('redis'),
	sio_redis = require('socket.io-redis');

if(cluster.isMaster){
	var numCPUs = require('os').cpus().length;
	for(var i=0;i<numCPUs;i++){
		var worker = cluster.fork();
		
		worker.on('listening',function(){
			console.log(this.process.pid + " is listening");
		});
	}
}else{
	server.listen(8086, 'localhost');
	
	var io = sio.listen(server);
	
	io.adapter(sio_redis({host: 'localhost', port: 6379 }));
	
	io.on('connection',function(socket){
		console.log(socket.id + ":"+cluster.worker.process.pid);
		socket.on('message',function(msg){
			socket.broadcast.emit('msgReceived',cluster.worker.process.pid+msg);
		});
	});
	
	app.get('/', function(req, res){
		console.log(cluster.worker.process.pid);
		res.sendfile('public/chat.html');
	});
}