/**
 * http://usejsdoc.org/
 * 使用require("fs")，载入fs模块，模块中所有方法都有同步和异步两种形式
 * 同步方法：方法执行完，返回结果之后，才能执行后续代码。
 * 异步方法：采用回调函数接受结果，回调函数的第一个参数总是留给异常参数，如果方法成功，这个参数时null或者undefined。直接执行后续代码。
 */

var fs = require('fs');
//readFile读取文件(filename,[options{encoding,flag}],callback)
fs.readFile('text.txt','utf-8',function(err,data){
	if(err){
		throw err;
	}
	//原始二进制,如果读取时，设置编码方式，可以无需转换
	//console.log(data);
	//变成字符串
	//console.log(data.toString());
});
//同步
//console.log(fs.readFileSync('text.txt'));

//writeFile写入文件(filename,data,[options(encoding,mode,flag)],callback)
//flag:r-读取文件，w-写入文件，a-追加写入文件
fs.writeFile('text2.txt','good morning,sir!',{'flag':'a'},function(err){
	if(err){
		throw err;
	}
	//console.log('saved.');
});

/**
 * 
 *使用fs.read,fs.write文件，需要fs.open,fs.close打开关闭文件。
 *fs.open(path,flags,[mode文件权限],callback)
 *flags：r,r+读取并写入文件,rs同步方式读取文件,rs+,w文件不存在创建，存在则清空,wx文件存在则报错,w+,wx+,a,ax文件不存在则报错,a+,ax+
 *fs.close(fd,[callback])关闭文件，fd是打开文件的描述符
*/
//fs.read(fd,buffer,offset,length,position,callback(err,bytesRead,buffer))接受6个参数
fs.open('testRead.txt','r',function(err,fd){
	if(err) throw err;
	console.log("read success!");
	var buffer = new Buffer(255);
	fs.read(fd,buffer,0,10,0,function(err,bytesRead,buffer){
		if(err) throw err;
		console.log(bytesRead,buffer.slice(0,bytesRead).toString());
	});
	
	fs.close(fd);
});

//fs.write(fd,buffer,offset,length,position,callback)方法与fs.read相同，buffer是需要写入文件的内容
fs.open('testWrite.txt','w',function(err,fd){
	if(err) throw err;
	var buffer = new Buffer("I'm zdf");
	fs.write(fd,buffer,0,buffer.length,0,function(err,writen,buffer){
		if(err) throw err;
		console.log("write success!");
		console.log(writen,buffer.slice(0,writen).toString());
	});
	
	fs.close(fd);
});

/**
 * 创建目录
 * fs.mkdir(path,[mode],callback)

fs.mkdir('testdir',function(err){
	if(err) throw err;
}) */
/**
 * 读取目录
 * fs.readdir(path,callback)
 */
fs.readdir('testdir',function(err,files){
	if(err) throw err;
	console.log(files);
});


