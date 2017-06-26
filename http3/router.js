/**
 * http://usejsdoc.org/
 */
var fs = require("fs");
var handle = require("./requestHandler");

function route(pathname,req,res){
	var handleName = pathname.substring(1);
	if(typeof handle[handleName] === 'function'){
		handle[handleName](req,res);
	}else{
		var content = fs.readFileSync('./views/404.html');
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write(content);
		res.end();
	}
}

exports.route = route;