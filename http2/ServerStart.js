/**
 * http://usejsdoc.org/
 */
var http = require("http");
var url = require("url");
var Router = require("./Router");

var host = '127.0.0.1',
port = 8080;

function ServerStart(){
	
	var router = new Router();
	
	function onRequest(req,res){
		var pathname = url.parse(req.url).pathname;
		console.log(pathname.substring(1,pathname.length));
		router.run(pathname.substring(1,pathname.length),req,res);
	}
	
	http.createServer(onRequest).listen(port,host);
	console.log('server start!');
}

ServerStart();


