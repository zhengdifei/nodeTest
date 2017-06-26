var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
//master是主进程
//判断是否是master进程
//根据cpu创建子进程
if(cluster.isMaster){
	console.log('[master] is running');
	
	for(var i =0;i<numCPUs;i++){
		var wk = cluster.fork();
		wk.send('[worker'+ wk.id +'] is created');
	}
	
	cluster.on('fork',function(worker){
		console.log('[master] fork:' + worker.id );
	});
	
	cluster.on('online',function(worker){
		console.log('[master] online:',worker.id);
	});
	
	cluster.on('listening',function(worker,address){
		console.log('[master] listening:' + worker.id + ',pid:' + worker.process.pid + ',Address:'+ address.address + ':' + address.port);
	});

	cluster.on('disconnect',function(worker){
		console.log('[master] disconnect:' + worker.id);
	});
	
	cluster.on('exit',function(worker,code,signal){
		console.log('[master] exit:' + worker.id);
	});
	
	function eachWorker(callback){
		for(var id in cluster.workers){
			callback(cluster.workers[id]);
		}
	}
	
	setTimeout(function(){
		eachWorker(function(worker){
			worker.send('[master] send message to worker :' + worker.id);
		});
	},3000);
	
	Object.keys(cluster.workers).forEach(function(id){
		cluster.workers[id].on('message',function(msg){
			console.log('[master] receive master message : ' + msg);
		});
		
	});
}else if(cluster.isWorker){
	console.log('[worker'+ cluster.worker.id +'] is running.');
	
	process.on('message',function(msg){
		console.log('[worker'+ cluster.worker.id +'] :' + msg);
		process.send('[worker'+ cluster.worker.id +'] receive,thank you!');
	});
	
	http.createServer(function(req,res){
		res.writeHead(200);
		res.end('Worker :' + cluster.worker.id + ' pid:'+ process.pid +' make a response.');
	}).listen(8000);
}