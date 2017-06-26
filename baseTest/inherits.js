/**
 * util.inherits(constructor, superConstructor)是一个实现对象间原型继承的函数。
 * JavaScript 的面向对象特性是基于原型的，与常见的基于类的不同。
 * JavaScript 没有 提供对象继承的语言级别特性，而是通过原型复制来实现的.
 */
var util = require('util');

function Base(){
	this.name = 'base';
	this.base = 1991;
	this.sayHello = function(){
		console.log('Hello ' + this.name);
	}
}

Base.prototype.name = 'prototype name';
Base.prototype.showName = function(){
	console.log(this.name);
}

function Sub(){
	this.name = 'sub';
}

//继承
util.inherits(Sub, Base);

var objBase = new Base();
console.log(objBase);
objBase.sayHello();
objBase.showName();

var objSub = new Sub();
console.log(objSub);
objSub.showName();
//objSub.sayHello();




