/**
 * http://usejsdoc.org/
 */
var http = require("http");
var url = require("url");

var host = '127.0.0.1',
port = 8080;

function start(route,handle){
	
	function onRequest(req,res){
		var pathname = url.parse(req.url).pathname;
		
		route(pathname,handle,req,res);
	}
	
	http.createServer(onRequest).listen(port,host);
	console.log('server start!');
}

exports.start = start;


