/**
 * promise的then函数
 * 异步操作
 * 方法传递：
 * 方法传递有些类似于Java中的try和catch。当一个异常没有响应的捕获时，这个异常会接着往下传递。
 * 顺序执行：通过promise链达到顺序执行的目的
 * Q.allSettled
 */
var Q = require('q');
var fs = require('fs');

function printFileContent(fileName){
	var defer = Q.defer();
	fs.readFile(fileName,'utf8',function(err,data){
		if(!err && data){
			console.log(data);
			defer.resolve(fileName + ' success');
		}else{
			defer.reject(fileName + 'fail');
		}
	})
	return defer.promise;
}

//手动链
Q.allSettled([printFileContent('test1.txt'),printFileContent('test2.txt')
       ,printFileContent('test3.txt'),printFileContent('test4.txt')]).then(function(results){
    	   results.forEach(function(result){
    		   console.log(result.state);
    	   });
       });