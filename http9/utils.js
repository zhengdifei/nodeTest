/**
 * zhengdifei
 */
var path = require("path");

exports.parseRange = function(str,size){
	//我们暂且不支持多区间吧。于是遇见逗号，就报416错误吧
	if(str.indexOf(',') != -1){
		return;
	}
	
	var range = str.split('-'),
	start = parseInt(range[0],10),
	end = parseInt(range[1],10);
	
	//case : -100
	if(isNaN(start)){
		start = size - end;
		end = size -1;
		
	//case : 100-
	}else if(isNaN(end)){
		end = size -1;
	}
	
	//Invalid
	if(isNaN(start) || isNaN(end) || start > end || end > size){
		return;
	}
	
	return {start : start,end : end};
}

exports.parseFileExt = function(fileName){
	//请求后缀
	var ext = path.extname(fileName);

	ext = ext ? ext.slice(1) : 'unknown';
	return ext;
}