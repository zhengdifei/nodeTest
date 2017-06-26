/**
 * http://usejsdoc.org/
 */
var net = require("net");

var client = net.connect({port:9999}, function(){
	console.log('connected to server');
	client.write('World!\r\n');
});

client.on('data',function(data){
	console.log('server data:',data.toString());
	//断开连接
	client.end();
});

client.on('end',function(){
	console.log('disconnected from server');
});