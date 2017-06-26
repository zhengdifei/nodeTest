/**
 * 基本实现了静态服务器的功能 
 * 有缓存功能
 * 通过Expires和Last-Modified两个方案以及与浏览器之间的通力合作，会节省相当大的一部分网络流量，同时也会降低部分硬盘IO的请求。
 * 如果在这之前还存在CDN的话，整个solution就比较完美了。
 */
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mime = require("./mime").types;
var config = require("./config");

function Server(configs) {
	this.configs = configs || {};

	this.host = '127.0.0.1';

	this.port = 8080;

	this.route = function(pathName, req, res) {
		// 处理首页
		pathName = pathName == '/' ? '/index.html' : pathName;

		var realPath = "../www" + pathName;
		
		fs.stat(realPath, function(err, stats) {
			if (!err) {
				fs.readFile(realPath, "binary", function(err, file) {
					if (err) {
						res.writeHead(500, {
							'Content-Type' : 'text/plain'
						});
						res.end();
						return;
					}

					// Last-Modified设置
					var lastModified = stats.mtime.toUTCString();

					var ifModifiedSince = "If-Modified-Since".toLowerCase();

					res.setHeader("Last-Modified", lastModified);

					if (req.headers[ifModifiedSince]
							&& lastModified == req.headers[ifModifiedSince]) {
						res.writeHead(304, "Not Modified");
						res.end();
						return;
					}

					var ext = path.extname(realPath);

					ext = ext ? ext.slice(1) : 'unknown';
					// 过期设置
					if (config.Expires.fileMath.test(ext)) {
						var expires = new Date();
						expires.setTime(expires.getTime()
								+ config.Expires.maxAge * 1000);

						res.setHeader("Expires", expires.toUTCString());

						res.setHeader("Cache-Control", "max-age="
								+ config.Expires.maxAge);

					}

					// mime类型处理
					var contentType = mime[ext] || 'text/plain';

					res.writeHead(200, {
						'Content-Type' : contentType
					});
					res.write(file, "binary");
					res.end();
				});
			} else {
				res.writeHead(404, {
					'Content-Type' : 'text/plain'
				});
				res.write("This URL " + pathName
						+ " was not found on this Server!");
				res.end();
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
		}).listen(me.port, me.host);

		console.log('server start!');
	};

	this.Constructor(); // 执行构造方法，初始化对象
}

var server = new Server();
