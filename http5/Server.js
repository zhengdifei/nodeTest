/**
 * 基本实现了静态服务器的功能
 * 无缓存功能
 */
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("./mime").types;

function Server(configs){
	this.configs = configs || {};
	
	this.host = '127.0.0.1';
	
	this.port = 8080;
	
	this.route = function(pathName,req,res){
		//处理首页
		pathName = pathName=='/' ? '/index.html' : pathName;
		
		var realPath = "../www" + pathName;
		
		fs.access(realPath,function(err){
			if(err){
				res.writeHead(404,{'Content-Type':'text/plain'});
				res.write("This URL " + pathName + " was not found on this Server!");
				res.end();
			}else{
				fs.readFile(realPath,"binary",function(err,file){
					if(err){
						res.writeHead(500,{'Content-Type':'text/plain'});
						res.end();
					}else{
						var ext = path.extname(realPath);
						
						ext = ext ? ext.slice(1) : 'unknown';
						
						var contentType = mime[ext] || 'text/plain';
						
						res.writeHead(200,{'Content-Type' : contentType});
						res.write(file,"binary");
						res.end();
					}
				});
			}
		});
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



