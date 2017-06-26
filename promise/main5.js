/**
 * promise的then函数
 * 异步操作
 * 方法传递：
 * 方法传递有些类似于Java中的try和catch。当一个异常没有响应的捕获时，这个异常会接着往下传递。
 * 顺序执行：通过promise链达到顺序执行的目的
 * 
 * 比如知道用户名，需要根据用户名从数据库中找到相应的用户，然后将用户信息传给下一个函数进行处理
 */
var Q = require('q');
var defer = Q.defer();

var users = [{'name':'andrew','password':'password'}];

function getUsername(){
	return defer.promise;
}

function getUser(username){
	var user;
	users.forEach(function(element){
		if(element.name === username){
			user = element;
		}
	});
	
	return user;
}

//promise链
getUsername().then(function(username){
	return getUser(username);
}).then(function(user){
	console.log(user);
});

defer.resolve('andrew1');