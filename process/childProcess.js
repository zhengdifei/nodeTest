/**
 * http://usejsdoc.org/
 */
var spawn = require('child_process').spawn;
//var ls= spawn('node',['./process.js']);

var ls= spawn('node',['-v']);

ls.stdout.on('data',function(data){
	console.log('stdout:' + data);
});

ls.stderr.on('data',function(data){
	console.log('stderr:' + data);
});

ls.on('close',function(code){
	console.log('child process exited with code ' + code);
});