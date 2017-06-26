/**
 * http://usejsdoc.org/
 */
process.on('message',function(m){
	console.log('child : ',m);
});

process.send({name : 'zhengdifei'});