/**
 * http://usejsdoc.org/
 */
var http = require("http");
var events = require("events");

var server = http.createServer();
//event绑定：on，addListener
//event绑定一次：once
//event可以绑定多个监听器
//event移除监控器：removeListener,移除所有监听器：removeAllListener
//设置event最大绑定数，setMaxListeners
//自定义事件：emitter.emit(event,[arg1]...)

server.on('myevent',function(args){
	console.log(args);
});

//查看事件绑定监听器个数listenerCount
console.log(events.EventEmitter.listenerCount(server,'myevent'));

server.emit('myevent','name:zdf');

server.listen(8888,'127.0.0.1');
console.log('server running at 8888');
