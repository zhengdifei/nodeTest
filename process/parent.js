/**
 * http://usejsdoc.org/
 */
var cp = require('child_process');

var sub = cp.fork('./child.js');

sub.on('message',function(m){
	console.log('parent : ',m);
});

sub.send({world : 'hello'});