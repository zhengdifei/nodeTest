/**
 * http://usejsdoc.org/
 */
var net = require("net");
//创建TCP服务器
var server = net.createServer(function(socket){
	console.log('client conneted!');
	//监听客户端数据
	socket.on('data',function(data){
		console.log('client data:',data.toString());
	});
	//监听客户端断开连接
	socket.on('end',function(data){
		console.log('client connection closed!');
	});
	//发送数据到客户端
	socket.write('Hello\r\n');
	//给sparkstreaming socket连接提供数据
	var charArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];
	while(true){
		var num = Math.round(1 + 5*Math.random());
		var str = '';
		for(var i =0;i<num;i++){
			str += charArray[Math.round(33*Math.random())]+" ";
		}
		socket.write(str);
		if(num == 2){
			socket.write("\r\n");
		}
		sleep(1000);
	}
});

function sleep(sleepTime) {
    for(var start = +new Date; +new Date - start <= sleepTime; ) { } 
}

server.listen(9999,function(){
	console.log('server running!');
});