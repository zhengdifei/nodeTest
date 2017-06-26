/**
 * promise的then函数
 */
var Q = require('q');
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
	return 'fulfilled';
},function(rejected){
	return 'rejected';
});
/**
 * 当outputPromise状态由未完成变成fulfil时，调用function(fulfilled)，控制台打印'fulfilled: fulfilled'。
 * 当outputPromise状态由未完成变成rejected, 调用function(rejected), 控制台打印'fulfilled: rejected'。
 * 
 * 当function(fulfilled)或者function(rejected)抛出异常时，那么outputPromise的状态就会变成rejected
 */
var thirdPromise = outputPromise.then(function(fulfilled){
	console.log('output1:' + fulfilled);
},function(rejected){
	console.log('output2:' + rejected);
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
defer.resolve();
