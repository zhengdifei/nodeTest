/**
 * 基本实现了静态服务器的功能 
 * 有缓存功能
 * gzip压缩功能
 * 安全，不允许地址中有../这种父路径
 * 
 * Range支持
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
var utils = require("./utils");

function Server(configs) {

	this.page404 = function(req,res){
		console.error(url.parse(req.url).pathname + " is not exist in this Server!");
		var rs = fs.createReadStream('../www/404.html');
		res.writeHead(404);
		rs.pipe(res);
	};
	
	//有缓存功能配置
	this.expiresHandler = function(lastModified,req,res){

		var ifModifiedSince = "If-Modified-Since".toLowerCase();

		res.setHeader("Last-Modified", lastModified);

		if (req.headers[ifModifiedSince]
				&& lastModified == req.headers[ifModifiedSince]) {
			res.writeHead(304, "Not Modified");
			res.end();
			
			return true;
		}
		
		//请求后缀
		var ext = utils.parseFileExt(url.parse(req.url).pathname);
		
		// 过期设置
		if (config.Expires.fileMatch.test(ext)) {
			var expires = new Date();
			expires.setTime(expires.getTime()
					+ config.Expires.maxAge * 1000);

			res.setHeader("Expires", expires.toUTCString());

			res.setHeader("Cache-Control", "max-age="
					+ config.Expires.maxAge);

		}
	};
	//必须要有返回rs对象
	this.zipHandler = function(rs,writeHead,filename,req,res){//rs对象时ReadStream
		//请求后缀
		var ext = utils.parseFileExt(filename);
		//gzip压缩
		var acceptEncoding = req.headers["accept-encoding"] || '';
			
		if(config.Compress.match.test(ext) && acceptEncoding.match(/gzip/)){
			writeHead['Content-Encoding'] = 'gzip';
			rs = rs.pipe(zlib.createGzip());//相当于在ReadStream里面添加一个GzipStream对象，pipe返回是GzipStream对象
		}else if(config.Compress.match.test(ext) && acceptEncoding.match(/deflate/)){
			writeHead['Content-Encoding'] = 'deflate';
			rs = rs.pipe(zlib.createDeflate());
		}
		//rs对象时GzipStream
		return rs;
	};
	
	this.rangeHandler = function(rs,req,res){
		//Range支持
		if(req.headers['range']){
			var range = utils.parseRange(req.headers["range"],stats.size);
			
			if(range){
				req.setHeader("Content-Range","bytes " + range.start + "-" + range.end + "/" +stats.size);
				req.setHeader("Content-length",(range.end -range.start + 1 ));
				
				rs = fs.createReadStream(realPath,{"start":range.start,"end":range.end});
				
				return 206;
			}else{
				req.removeHeader("Content-Length");
			    
			    return 416;
			}
		}
	};
	
	this.mimeHandler = function(fileName){
		//请求后缀
		var ext = utils.parseFileExt(fileName);
		// mime类型处理
		var contentType = mime[ext] || 'text/plain';
		
		return contentType;
	};
	
	this.route = function(pathName, req, res) {
		var me = this;
		// 处理首页
		pathName = pathName == '/' ? config.Welcome.file : pathName;
		//处理父路径
		pathName = path.normalize(pathName.replace(/\.\./g,''));
		//真实路径
		var realPath = path.join("../www",pathName);
		
		fs.stat(realPath, function(err, stats) {
			if (!err) {
				if(stats.isFile()){
					var statusCode = 200;
					
					var writeHead = {};
					
					var rs = fs.createReadStream(realPath);
					
					//range处理
					var rangeMark = me.rangeHandler(rs, req, res);
					if(rangeMark == 206){
						statusCode = 206;
					}else if(rangeMark == 416){
						res.writeHead(416,"Request Range Not Satisfiable");
						res.end;
						return;
					}
					
					// Last-Modified处理
					if(me.expiresHandler(stats.mtime.toUTCString(), req, res)) return;
					
					//gzip处理，rs必须是GzipStream对象，js中指针，我还没有完全理解清楚
					rs = me.zipHandler(rs,writeHead,realPath,req, res);
					/*
					 * response不一定需要向前台传递Content-Type属性，在firefox测试，无此参数，运行正常。
					 * 因此，可以不用考虑文件的mime属性。
					 */
					writeHead['Content-Type'] = me.mimeHandler(realPath);
					
					//配置服务器名称
					res.setHeader("Server","Node/ZDF");

					res.writeHead(statusCode, writeHead);
					
					rs.pipe(res);
				}else{
					me.page404(req,res);
				}
			} else {
				me.page404(req,res);
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
			me.route(url.parse(req.url).pathname, req, res);
			
		}).listen(config.Server.port, config.Server.ip);

		console.log('server start!');
	};

	this.Constructor(); // 执行构造方法，初始化对象
}

var server = new Server();
