/**
 * 问题分析:
 * 我们前面提到有请求发起时，由系统来决定将该请求交给哪个进程进行处理。
 * 这种完全依赖于系统的负载均衡存在着一个重要缺陷：在windows，linux和Solaris上，
 * 只要某个子进程的accept queue为空（通常为最后创建的那个子进程），
 * 系统就会将多个connetion分配到同一个子进程上，这会造成进程间负载极为不均衡。
 * 特别是在使用长连接的时候，单位时间内的new coming connection并不高，
 * 子进程的accept queue往往均为空，就会导致connection会不停的分配给同一个进程。
 * 所以这种负载均衡完全依赖于accept queue的空闲程度，只有在使用短连接，而且并发非常高的情况下，
 * 才能达到负载均衡，但是这个时候系统的load会非常高，系统也会变得不稳定起来。
 */
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
//master是主进程
//判断是否是master进程
//根据cpu创建子进程
if(cluster.isMaster){
	console.log(cluster);
	for(var i =0;i<numCPUs;i++){
		cluster.fork();
	}

	Object.keys(cluster.workers).forEach(function(id){
		console.log('I am running with ID : ' + cluster.workers[id].process.pid);
	});
	
	cluster.on('exit',function(worker,code,signal){
		console.log('worker ' + worker.process.pid + ' died');
	});
}else{
	//这段代码很简单，主线程就是当前运行的js文件，主线程根据你本机系统的核数来创建子进程。
	//所有进程共享一个监听端口8000，当有请求发起时，主线程会将该请求随机分配给某个子进程。
	//console.log('Worker #' + cluster.worker.id + ' make a response');
	//这句代码可以打印出是哪个进程处理该请求。
	http.createServer(function(req,res){
		console.log('Worker :' + cluster.worker.id + ' make a response.');
		res.writeHead(200);
		res.end('Hello world\n');
	}).listen(8000);
}