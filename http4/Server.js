/**
 * 根据配置文件，提供访问——文件之间的映射关系
 */
var http = require("http");
var url = require("url");
var fs = require("fs");
var urlmap = require('./urlmap');

function Server(configs){
	this.configs = configs || {};
	
	this.host = '127.0.0.1';
	
	this.port = 8080;
	
	this.urlMap = urlmap;
	
	this.route = function(pathname,req,res){
		if(pathname in this.urlMap){
			var content = fs.readFileSync(this.urlMap[pathname]);
			res.writeHead(200,{'Content-Type':'text/html'});
			res.write(content);
			res.end();
		}else if(pathname == "/common.action"){
			
		}else{
			var content = fs.readFileSync('./views/404.html');
			res.writeHead(200,{'Content-Type':'text/html'});
			res.write(content);
			res.end();
		}
	};
	
	/** 初始化操作区 */
	this.Constructor = function() {// 构造方法
		var me = this;
		
		for ( var name in me.configs) {// 初始化属性
			this[name] = me.configs[name];
		}
		
		http.createServer(function(req,res){
			var pathname = url.parse(req.url).pathname;
			
			me.route(pathname,req,res);
		}).listen(me.port,me.host);
		
		console.log('server start!');
	};
	
	this.Constructor(); // 执行构造方法，初始化对象
}

var server = new Server();



