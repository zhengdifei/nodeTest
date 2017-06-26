var fs = require("fs");
var cp = require("child_process");
//这种子线程的方式还是解决不了阻塞模式
//一般意义上说node非阻塞不是题主的busy-wait+子进程的实现方式（动辄cpu100%完全顶不住压力），而是事件队列，单进程单线程的非阻塞
function home1(req,res){
	cp.exec('node -v',{timeout:5000},function(){
		console.log('1');
		function sleep(milliSeconds){
			var startTime = new Date().getTime();
			while(new Date().getTime()<startTime + milliSeconds);
		}
		
		sleep(10000);
		var content = fs.readFileSync('./views/home.html');
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write(content);
		res.end();
	});	
}

//简单来说，就是事件（比如setTimeout，或者更常见的网络／文件IO等）来了以后，
//如果当前状态是空闲的，那么会立刻处理；而如果正在执行其他代码，则会推入队列中，等待执行完毕后才处理。
//所以微观来说，一个node进程同一时间永远最多只在处理一个请求。但由于多数业务都是IO密集型，
//主要瓶颈往往落在磁盘IO，数据库或其他服务的网络IO等等，实际的业务CPU运算很少，
//此时node多数时间都处于等待IO回调的空闲状态，因此宏观上来看一个node进程往往可以同时处理大量的业务请求
function home(req,res){
	setTimeout(function(){
		var content = fs.readFileSync('./views/home.html');
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write(content);
		res.end();
	},10000);
}

function about(req,res){
	var content = fs.readFileSync('./views/about.html');
	res.writeHead(200,{'Content-Type':'text/html'});
	res.write(content);
	res.end();
}

exports.home = home;
exports.about = about;