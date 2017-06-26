/**
 * http://usejsdoc.org/
 */

//process.stdin.resume();

process.stdin.setEncoding('utf8');

process.stdin.on('readable',function(){
	var chunk = process.stdin.read();
	if(chunk !== null){
		process.stdout.write('data:' + chunk);
	}
	if(chunk === 'exit\r\n'){
		process.exit();
	}
});

process.stdin.on('end',function(){
	process.stdout.write('end');
});

/*
process.on('SIGINT',function(){
	console.log('Sigint');
});
*/
console.log('cwd:' + process.cwd());
process.chdir('../');
console.log('cwd:' + process.cwd());

process.on('beforeExit',function(code){
	console.log('before exit run');
});

process.on('exit',function(code){
	setTimeout(function(){
		console.log('not run');
	});
	
	console.log('exit code:',code);
});
