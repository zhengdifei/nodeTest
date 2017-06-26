var express = require('express'),
	app = express(),
	server = require('http').createServer(app).listen(8081),
	sio = require('socket.io'),
	io = sio.listen(server),
	redis = require('redis');
    
var sub = redis.createClient();
sub.subscribe('chat');
var pub = redis.createClient();

io.on('connection',function(socket){
	sub.on('message',function(channle,msg){
		console.log(channle);
		console.log('redis message :',msg);
		socket.emit('msgReceived',msg);
	});
	
	socket.on('message',function(msg){
		console.log('client:',msg);
		pub.publish('chat',msg);
	});
});

app.get('/', function(req, res){
	res.sendfile('public/chat.html');
});