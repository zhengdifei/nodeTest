var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	sio = require('socket.io'),
	cluster = require('cluster'),
	
	redis = require('redis');
    
if(cluster.isMaster){
	var numCPUs = require('os').cpus().length;
	for(var i=0;i<numCPUs;i++){
		var worker = cluster.fork();
		
		worker.on('listening',function(){
			console.log(this.process.pid + " is listening");
		});
	}
}else{
	server.listen(8083);
	var io = sio.listen(server);
	
	var sub = redis.createClient();
	sub.subscribe('chat');
	var pub = redis.createClient();

	io.on('connection',function(socket){
		sub.on('message',function(channle,msg){
			console.log('redis message :',msg);
			socket.emit('msgReceived',process.pid + msg);
		});
		
		socket.on('message',function(msg){
			console.log('client:',msg);
			pub.publish('chat',msg);
		});
	});

	app.get('/', function(req, res){
		res.sendfile('public/chat.html');
	});
}