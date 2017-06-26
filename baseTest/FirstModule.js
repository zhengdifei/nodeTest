/**
 * http://usejsdoc.org/
 */
function FirstModule(){
	this.hello = function(){
		return "hello";
	};
	
	this.world = function(){
		return "world";
	};
}

//exports.hw = FirstModule;
module.exports = FirstModule;