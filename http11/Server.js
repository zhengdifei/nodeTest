/**
 * mongodb持久层实现
 * list : http://localhost:8080/common.action?command=T_BASE_FIELD.selectAll
 * 		  http://localhost:8080/common.action?command=T_BASE_FIELD.selectByName&name=fei
 * object:http://localhost:8080/common.action?command=T_BASE_FIELD.selectById&_id=56c9734c3bdaede43af4af6b
 * insert:http://localhost:8080/common.action?command=T_BASE_FIELD.insertArray&name=fei&age=25&sex=false&abc1=zdf
 *        http://localhost:8080/common.action?command=T_BASE_FIELD.insertJson&name=fei&age=25&sex=true&abc1=zdf
 * delete:http://localhost:8080/common.action?command=T_BASE_FIELD.deleteByName&name=fei2
 * 	      http://localhost:8080/common.action?command=T_BASE_FIELD.deleteById&_id=56b43b6ca7b0d50c040a2785
 * update:http://localhost:8080/common.action?command=T_BASE_FIELD.updateById&_id=56c973423bdaede43af4af69&name=fei
 * 
 * 添加socketIO支持
 */

var http = require("http");
var socketIO = require('socket.io');
var url = require("url");
var fs = require("fs");
var path = require("path");
var zlib = require("zlib");
var qs = require("querystring");
var mime = require("./view/mime").types;
var utils = require("./util/utils");
var cookie = require("./view/cookie");
var Session = require("./view/Session");
var SessionManager = require("./view/SessionManager");
var config = require("./config/config");
var Engine = require("./service/Engine");
var EngineParameter = require("./service/EngineParameter");

function Server(configs) {
	//SessionManager初始化
	this.sessionManager = new SessionManager(config.Session.timeout);
	//404错误文件
	this.page404 = function(req,res){
		console.error(url.parse(req.url).pathname + " is not exist in this Server!");
		var rs = fs.createReadStream('../www/404.html');
		res.writeHead(404);
		rs.pipe(res);
	};
	
	//有缓存功能配置
	this.expiresHandler = function(lastModified,ext,req,res){

		var ifModifiedSince = "If-Modified-Since".toLowerCase();

		res.setHeader("Last-Modified", lastModified);

		if (req.headers[ifModifiedSince]
				&& lastModified == req.headers[ifModifiedSince]) {
			res.writeHead(304, "Not Modified");
			res.end();
			
			return true;
		}		
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
	
	//gzip压缩,必须要有返回rs对象
	this.zipHandler = function(rs,ext,req,res){//rs对象时ReadStream
		var acceptEncoding = req.headers["accept-encoding"] || '';
			
		if(config.Compress.match.test(ext) && acceptEncoding.match(/gzip/)){
			res.setHeader('Content-Encoding' , 'gzip');
			rs = rs.pipe(zlib.createGzip());//相当于在ReadStream里面添加一个GzipStream对象，pipe返回是GzipStream对象
		}else if(config.Compress.match.test(ext) && acceptEncoding.match(/deflate/)){
			res.setHeader('Content-Encoding' , 'deflate');
			rs = rs.pipe(zlib.createDeflate());
		}
		//rs对象时GzipStream
		return rs;
	};
	
	//Range支持
	this.rangeHandler = function(rs,req,res){
		
		if(req.headers['range']){
			var range = utils.parseRange(req.headers["range"],stats.size);
			
			if(range){
				req.setHeader("Content-Range","bytes " + range.start + "-" + range.end + "/" +stats.size);
				req.setHeader("Content-length",(range.end -range.start + 1 ));
				
				rs = fs.createReadStream(realPath,{"start":range.start,"end":range.end});
				
				res.statusCode = 206;
			}else{
				req.removeHeader("Content-Length");
			    
				res.statusCode = 416;
				
				res.write("Request Range Not Satisfiable");
				res.end;
				return true;
			}
		}
	};
	
	// mime类型处理
	this.mimeHandler = function(ext,req,res){
		
		var contentType = mime[ext] || 'text/plain';
		
		res.setHeader('Content-Type',contentType);
	};
	
	//cookie解析
	this.parseCookie = function(req,res){
		return cookie.parse(req.headers.cookie || "");
	};
	
	//设置cookie
	this.setCookie = function(cookieObj,req,res){
		var _cookieArr = res.getHeader("Set-Cookie") || [];
		
		_cookieArr.push(cookie.stringify(cookieObj));

		res.setHeader("Set-Cookie",_cookieArr);
	};
	//静态文件处理
	this.staticFile = function(realPath,ext,req,res){
		var me = this;
		
		fs.stat(realPath, function(err, stats) {
			if (!err) {
				if(stats.isFile()){
					res.statusCode = 200;
					
					var rs = fs.createReadStream(realPath);
					
					//range处理
					if(me.rangeHandler(rs, req, res)) return;
					
					// Last-Modified处理
					if(me.expiresHandler(stats.mtime.toUTCString(),ext,req, res)) return;
					
					//gzip处理，rs必须是GzipStream对象，js中指针，我还没有完全理解清楚
					rs = me.zipHandler(rs,ext,req, res);
					/*
					 * response不一定需要向前台传递Content-Type属性，在firefox测试，无此参数，运行正常。
					 * 因此，可以不用考虑文件的mime属性。
					 */
					me.mimeHandler(ext,req,res);
					
					//配置服务器名称
					res.setHeader("Server","Node/ZDF");

					rs.pipe(res);
				}else{
					me.page404(req,res);
				}
			} else {
				me.page404(req,res);
			}
		});
	};
	
	//处理get请求
	this.doGet = function(req,res){
		var _paramMap = url.parse(req.url,true).query || {};
		var ep = new EngineParameter(_paramMap['command']);
		delete _paramMap['command'];
		ep.setParamMap(_paramMap);
		
		Engine.execute(ep,function(err){
			if(err){
				res.writeHead(500);
				res.write(JSON.stringify({success:false,msg:'query failed'}));
				res.end();
				return;
			}
			res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
			res.write(JSON.stringify(ep['resultMap']));
			res.end();
		});
	};
	
	//创建session
	this.createSession = function(req,res){
		var session = null;
		var cookie = this.parseCookie(req, res);
		if(cookie[config.Session.KEY] && this.sessionManager.get(cookie[config.Session.KEY])){
			session = this.sessionManager.get(cookie[config.Session.KEY]);
		}
		
		if(session == null){
			var session = new Session();
			this.sessionManager.set(session);
			this.setCookie({'key':config.Session.KEY,'value':session.sessionId},req,res);
		}
		
		return session;
	}
	//处理post请求
	this.doPost = function(req,res){
		var me = this;
		var _postData = "";
		var _paramMap = url.parse(req.url,true).query;
		
		req.on('data',function(chunk){
			_postData += chunk;
		}).on('end',function(){
			req.postData = _postData;
			/**
			 * res.setHeader('Set-Cookie',['JSESSIONID=zhengdifei123456','kpid=abc']);
			 */
			var session = me.createSession(req,res);
			//处理参数
			var _postMap = qs.parse(_postData) || {};
			for(var name in _postMap){
				_paramMap[name] = _postMap[name];
			};

			var ep = new EngineParameter(_paramMap['command']);
			delete _paramMap['command'];
			ep.setParamMap(_paramMap);
			
			Engine.execute(ep,function(err){
				if(err){
					res.writeHead(500);
					res.write({success:false,msg:'query failed'});
					res.end();
					return;
				}
				res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
				res.write(JSON.stringify(ep['resultMap']));
				res.end();
			});
		});
	};
	
	//动态文件处理
	this.dynamicFile = function(req, res){		
		if(req.method === 'GET'){
			this.doGet(req,res);
		}else if(req.method === 'POST'){
			this.doPost(req,res);
		}else{
			this.page404(req.res);
		}
	};
	
	//路由器
	this.route = function(req, res) {
		var me = this;
		//访问路径
		pathName = url.parse(req.url).pathname;
		// 处理首页
		pathName = pathName == '/' ? config.Welcome.file : pathName;
		//处理父路径
		pathName = path.normalize(pathName.replace(/\.\./g,''));
		//真实路径
		var realPath = path.join("../www",pathName);
		//请求后缀
		var ext = utils.parseFileExt(realPath);
			
		if(ext == "action"){
			if(path.basename(realPath,'.action') == "common"){
				me.dynamicFile(req, res);
			}else{
				me.page404(req,res);
			}
		}else{
			me.staticFile(realPath,ext,req,res);
		}
	};

	/** 初始化操作区 */
	this.Constructor = function() {// 构造方法
		var me = this;

		for ( var name in me.configs) {// 初始化属性
			this[name] = me.configs[name];
		}

		var serverInstance = http.createServer(function(req, res) {
			me.route(req, res);
			
		}).listen(config.Server.port, config.Server.ip);

		/*
		 * 添加了websocket支持
		 * 测试地址：http://localhost:8080/socketio/chat.html
		 */
		io = socketIO.listen(serverInstance);
		
		io.on('connection',function(socket){
			console.log('zdf');
			socket.emit('open');
			
			socket.on('message',function(msg){
				console.log(msg);
				//返回欢迎语
		        socket.emit('system','system:' + msg);
		        
		        socket.send('system:' + msg);
			});
		});
		
		console.log('server start!');
	};

	this.Constructor(); // 执行构造方法，初始化对象
}

var server = new Server();
