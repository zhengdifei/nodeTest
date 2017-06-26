var fs = require("fs");

function home(req,res){
	var content = fs.readFileSync('./views/home.html');
	res.writeHead(200,{'Content-Type':'text/html'});
	res.write(content);
	res.end();
}

function about(req,res){
	var content = fs.readFileSync('./views/about.html');
	res.writeHead(200,{'Content-Type':'text/html'});
	res.write(content);
	res.end();
}

exports.home = home;
exports.about = about;