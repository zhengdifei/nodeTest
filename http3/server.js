/**
 * http://usejsdoc.org/
 */
var http = require("http");
var url = require("url");
var router = require("./router");

var host = '127.0.0.1',
port = 8080;

function start(){
	
	function onRequest(req,res){
		var pathname = url.parse(req.url).pathname;
		
		router.route(pathname,req,res);
	}
	
	http.createServer(onRequest).listen(port,host);
	console.log('server start!');
}

exports.start = start;


