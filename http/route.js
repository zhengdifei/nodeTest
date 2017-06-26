/**
 * http://usejsdoc.org/
 */
var fs = require("fs");

function route(pathname,handle,req,res){
	if(typeof handle[pathname] === 'function'){
		handle[pathname](req,res);
	}else{
		var content = fs.readFileSync('./views/404.html');
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write(content);
		res.end();
	}
}

exports.route = route;