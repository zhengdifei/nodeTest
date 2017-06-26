/**
 * 基本实现了静态服务器的功能 
 * 有缓存功能
 * gzip压缩功能
 * 安全，不允许地址中有../这种父路径
 * 
 * 测试发现：IE浏览器对于nodejs服务器支持不好，nodejs拒绝IE发出的请求
 */

var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var zlib = require("zlib");
var mime = require("./mime").types;
var config = require("./config");


function Server(configs) {

	this.page404 = function(res){
		var rs = fs.createReadStream('../www/404.html');
		res.writeHead(404);
		rs.pipe(res);
	};
	
	this.route = function(pathName, req, res) {
		var me = this;
		// 处理首页
		pathName = pathName == '/' ? config.Welcome.file : pathName;
		//处理父路径
		pathName = path.normalize(pathName.replace(/\.\./g,''));
		
		var realPath = path.join("../www",pathName);
		
		fs.stat(realPath, function(err, stats) {
			if (!err) {
				if(stats.isFile()){
					var rs = fs.createReadStream(realPath);
					var writeHead = {};
					// Last-Modified设置
					var lastModified = stats.mtime.toUTCString();
	
					var ifModifiedSince = "If-Modified-Since".toLowerCase();
	
					res.setHeader("Last-Modified", lastModified);
	
					if (req.headers[ifModifiedSince]
							&& lastModified == req.headers[ifModifiedSince]) {
						res.writeHead(304, "Not Modified");
						rs.pipe(res);
						
						return;
					}
	
					var ext = path.extname(realPath);
	
					ext = ext ? ext.slice(1) : 'unknown';
					// 过期设置
					if (config.Expires.fileMatch.test(ext)) {
						var expires = new Date();
						expires.setTime(expires.getTime()
								+ config.Expires.maxAge * 1000);
	
						res.setHeader("Expires", expires.toUTCString());
	
						res.setHeader("Cache-Control", "max-age="
								+ config.Expires.maxAge);
	
					}
					//gzip压缩
					var acceptEncoding = req.headers["accept-encoding"] || '';
						
					if(config.Compress.match.test(ext) && acceptEncoding.match(/gzip/)){
						writeHead['Content-Encoding'] = 'gzip';
						rs = rs.pipe(zlib.createGzip());
					}else if(config.Compress.match.test(ext) && acceptEncoding.match(/deflate/)){
						writeHead['Content-Encoding'] = 'deflate';
						rs = rs.pipe(zlib.createDeflate());
					}
					
					// mime类型处理
					var contentType = mime[ext] || 'text/plain';
					/*
					 * response不一定需要向前台传递Content-Type属性，在firefox测试，无此参数，运行正常。
					 * 因此，可以不用考虑文件的mime属性。
					 */
					
					writeHead['Content-Type'] = contentType;
					
					res.writeHead(200, writeHead);
					
					rs.pipe(res);
				}else{
					console.error(realPath + "is not exist in this Server!");
					me.page404(res);
				}
			} else {
				console.error(realPath + "is not exist in this Server!");
				me.page404(res);
			}
		});
	};

	/** 初始化操作区 */
	this.Constructor = function() {// 构造方法
		var me = this;

		for ( var name in me.configs) {// 初始化属性
			this[name] = me.configs[name];
		}

		http.createServer(function(req, res) {
			var pathname = url.parse(req.url).pathname;

			me.route(pathname, req, res);
		}).listen(config.Server.port, config.Server.ip);

		console.log('server start!');
	};

	this.Constructor(); // 执行构造方法，初始化对象
}

var server = new Server();
