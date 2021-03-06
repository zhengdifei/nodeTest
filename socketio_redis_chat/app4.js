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
	
	var s = net.createServer({ pauseOnConnect: true }, function(connection){
		var num = Math.round(Math.random()*4);
		if(num == 0) num++;
		console.log('worker nid:',num);
		cluster.workers['1'].send('zdf:connection',connection);
	}).listen(8084);
}else{
	app.listen(0, 'localhost');
	
	var io = sio(server);
	
	io.adapter(sio_redis({host: 'localhost', port: 6379 }));
	
	io.on('connection',function(socket){
		console.log(socket.id + ":"+cluster.worker.process.pid);
		socket.on('message',function(msg){
			socket.broadcast.emit('msgReceived',cluster.worker.process.pid+msg);
		});
	});
	
	process.on('message',function(message,connection){
		if(message !== 'zdf:connection'){
			return;
		}
		
		server.emit('connection',connection);
		
		connection.resume();
	});
	
	app.get('/', function(req, res){
		res.sendfile('public/chat.html');
	});
}