/**
 * http://usejsdoc.org/
 */
var net = require('net');

//创建TCP服务器
var server = net.createServer();

//多个client
var socketsMap = {};

server.on('connection',function(socket){
	
	
	socket.on('data',function(data){
		var str = data.toString();
		var nameIndex = str.indexOf(":");
		var name = null;
		if(str.substring(0,2) == '@@'){
			name = str.substring(2,nameIndex);
			if(socketsMap[name] == null){
				socketsMap[name] = socket;
				console.log(name + ' join the family!');
			}else{
				socket.write('['+ name +'] is used by other person,please change your name!');
				socket.end();
			}
		}else{
			name = str.substring(1,nameIndex);
			console.log(str);
			//点对点聊天
			if(str.indexOf(" ") != -1 && str.substring(nameIndex+1,nameIndex+2) == '@'){
				var toUserName = str.substring(nameIndex+2,str.indexOf(" "));
				if(socketsMap[toUserName] != null){
					socketsMap[toUserName].write( data );
				}else{
					socket.write(toUserName + ' isn\'t joined us or error username！');
				}
			//群聊
			}else{
				for(var n in socketsMap){
					if(n != name){
						socketsMap[n].write( data );
					}
				}
			}
		}
	});
	
	socket.on('close',function(){
		var name = null;
		var mark = false;
		for(var n in socketsMap){
			if( socketsMap[n] == socket){
				name = n;
				delete socketsMap[n];
				mark = true;
			}
		}
		if(mark){
			for(var n in socketsMap){
				socketsMap[n].write(name + ' is gone!');
			}
		}
	});
	
});

server.on('listening',function(){
	console.log('Server running!');
});

server.on('error',function(err){
	console.log('Server error:',err.message);
});

server.on('close',function(){
	console.log('Server closed');
});

server.listen(8080);