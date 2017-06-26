/**
 * http://usejsdoc.org/
 */
var dgram = require('dgram');

var client = dgram.createSocket('udp4');

process.stdin.setEncoding('utf8');
process.stdin.on('data',function(data){
	var message = new Buffer(data);
	client.send(message,0,message.length,33133,'127.0.0.1',function(err,bytes){
		if(err) throw err;
	});
});

client.on('message',function(msg,rinfo){
	console.log(msg.toString());
});
