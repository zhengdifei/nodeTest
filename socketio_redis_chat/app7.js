/**
 * socket.io-emitter allows you to communicate with socket.io servers easily from non-socket.io processes.
 */
var ioe = require('socket.io-emitter')({ host : '127.0.0.1',port : 6379});

setInterval(function(){
	  ioe.emit('time', new Date);
}, 5000);