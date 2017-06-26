/**
 * promise的then函数
 * 异步操作
 * 方法传递：
 * 方法传递有些类似于Java中的try和catch。当一个异常没有响应的捕获时，这个异常会接着往下传递。
 */
var Q = require('q');
var fs = require('fs');
var defer = Q.defer();
/**
 * 通过defer获得promise
 * @private
 */
function getInputPromise(){
	return defer.promise;
}
/**
 * 当inputPromise状态由未完成变成fulfil时，调用function(fulfilled)
 * 当inputPromise状态由未完成变成rejected时，调用function(rejected)
 * 将then返回的promise赋给outputPromise
 * function(fulfilled) 和 function(rejected) 通过返回字符串将outputPromise的状态由
 * 未完成改变为fulfilled
 * @private
 */
var outputPromise = getInputPromise().then(function(fulfilled){
	console.log('1');
	var myDefer = Q.defer();
	fs.readFile('test.txt','utf8',function(err,data){
		if(!err && data){
			console.log('2');
			myDefer.resolve(data);
		}
	});
	console.log('3');
	return myDefer.promise;
}).progress(function(msg){
	console.log(msg);
});
/**
 * 当outputPromise状态由未完成变成fulfil时，调用function(fulfilled)，控制台打印'fulfilled: fulfilled'。
 * 当outputPromise状态由未完成变成rejected, 调用function(rejected), 控制台打印'fulfilled: rejected'。
 * 
 * 当function(fulfilled)或者function(rejected)抛出异常时，那么outputPromise的状态就会变成rejected
 */
var thirdPromise = outputPromise.then(function(fulfilled){
	console.log('output1:' + fulfilled);
}).fail(function(err){
	console.log('output2:' + err);
});


thirdPromise.then(function(fulfilled){
	console.log('third3:' + fulfilled);
},function(rejected){
	console.log('third4:' + rejected);
});
/**
 * 将inputPromise的状态由未完成变成rejected
 */
//defer.reject();
/**
 * 将inputPromise的状态由未完成变成fulfilled
 */
//defer.resolve();

defer.notify(1);
defer.notify(2);
