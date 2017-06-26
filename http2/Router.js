/**
 * http://usejsdoc.org/
 */
var RequestHandler = require("./RequestHandler");
var fs = require("fs");

function Router(){
	this.rh = new RequestHandler();
	
	this.run = function(pathname,req,res){
		if(typeof this.rh[pathname] === 'function'){
			this.rh[pathname](req,res);
		}else{
			var content = fs.readFileSync('./views/404.html');
			res.writeHead(200,{'Content-Type':'text/html'});
			res.write(content);
			res.end();
		}
	}
}

module.exports = Router;