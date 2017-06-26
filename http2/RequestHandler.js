var fs = require("fs");

function RequestHandler(){
	this.home = function(req,res){
		var content = fs.readFileSync('./views/home.html');
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write(content);
		res.end();
	}

	this.about = function(req,res){
		var content = fs.readFileSync('./views/about.html');
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write(content);
		res.end();
	}
}

module.exports = RequestHandler;