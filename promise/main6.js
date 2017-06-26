/**
 * promise的then函数
 * 异步操作
 * 方法传递：
 * 方法传递有些类似于Java中的try和catch。当一个异常没有响应的捕获时，这个异常会接着往下传递。
 * 顺序执行：通过promise链达到顺序执行的目的
 */
var Q = require('q');

function foo(result){
	console.log(result);
	return result + " " + result; 
}
//手动链接
Q('hello1').then(foo).then(foo).then(foo);

//动态链接
var funcs = [foo,foo,foo];
var result = Q('hello2');

funcs.forEach(function(func){
	result = result.then(func);
});

//精简后的动态链接
funcs.reduce(function(prev,current){
	return prev.then(current);
},Q('hello3'));
