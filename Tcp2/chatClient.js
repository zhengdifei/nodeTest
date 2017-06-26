/**
 * http://usejsdoc.org/
 */
var net = require("net");

var client = null;
var myName = "";

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data',function(data){
	if(client == null){
		client = net.connect({port:8080},function(){
			console.log('Connected to server');
			myName = data.replace(/\r\n/,'');
			console.log('you name:' + myName);
			client.write("@@" + myName + ":join the Server!");
		});
		
		client.on('data',function(data){
			console.log(data.toString());
		});

		client.on('end',function(){
			console.log('client closed!');
			client = null;
		});
	}else{
		if(data === 'close\r\n'){
			client.end();
		}else{
			client.write("@"+ myName + ":" + data.replace(/\r\n/,''));
		}
	}
});