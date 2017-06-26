/**
 * promise的then函数
 * 异步操作
 * 方法传递：
 * 方法传递有些类似于Java中的try和catch。当一个异常没有响应的捕获时，这个异常会接着往下传递。
 * 顺序执行：通过promise链达到顺序执行的目的
 */
var Q = require('q');
var fs = require('fs');

function printFileContent(fileName){
	return function(){
		var defer = Q.defer();
		fs.readFile(fileName,'utf8',function(err,data){
			if(!err && data){
				console.log(data);
				defer.resolve();
			}
		});
		return defer.promise;
	}
}

//手动链
printFileContent('test1.txt')()
	.then(printFileContent('test2.txt'))
	.then(printFileContent('test3.txt'))
	.then(printFileContent('test4.txt'));
