/**
 * http://usejsdoc.org/
 */
var EventEmitter = require('events');
var util = require('util');

function MyEvent(){
	console.log(this);
	EventEmitter.call(this);
	console.log(this);
}

console.log(MyEvent);
util.inherits(MyEvent,EventEmitter);
console.log(MyEvent);

var newEvent = new MyEvent();
newEvent.on('first',function(config){
	console.log(config);
});

newEvent.emit('first','hello world,event!');