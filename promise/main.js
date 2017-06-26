/**
 * promise的基本定义
 */
var Q = require('q');
var defer = Q.defer();
/**
 * 获取初始promise
 * @private
 */
function getInitialPromise(){
	console.log('4');
	return defer.promise;
}
/**
 * 为promise设置三种状态的回调函数
 */
getInitialPromise().then(function(success){
	console.log('1');
	console.log(success);
},function(error){
	console.log('2');
	console.log(error);
},function(progress){
	console.log('3');
	console.log(progress);
});

defer.notify('in progress1');
defer.resolve('resolve2');
defer.reject('reject3');