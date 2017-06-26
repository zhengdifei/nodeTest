/**
 * http://usejsdoc.org/
 */
var dgram = require('dgram');

var server = dgram.createSocket("udp4");
var clients = [];

process.stdin.setEncoding('utf8');
process.stdin.on('data',function(data){
	var message = new Buffer('Server : ' + data);
	clients.forEach(function(c){
		server.send(message,0,message.length,c.port,c.address,function(err,bytes){
			if(err) throw err;
		});
	});

});

server.on('error',function(err){
	console.log('server error:\n' + err.stack);
});

server.on('message',function(msg,rinfo){
	console.log(clients);
	var message = '['+rinfo.address+':'+rinfo.port+'] : ' + msg.toString();
	var mark = true;
	clients.forEach(function(c){
		if(c.address == rinfo.address && c.port == rinfo.port){
			mark = false;
		}else{
			server.send(message,0,message.length,c.port,c.address,function(err,bytes){
				if(err) throw err;
			});
		}
	});
	if(mark) clients.push(rinfo);
	console.log(message);
});

server.on('listening',function(){
	var address = server.address();
	console.log('server listening on ' + address.address + ':' + address.port);
});

server.bind(33133);
//console.log(process);