/**
 * cookie解析
 */
exports.parse = function(cookie){
	var map = {};
	var pairs = cookie.split(";");
	pairs.forEach(function(pair){
		var kv = pair.split("=");
		map[kv[0]] = kv[1] || "";
	});
	
	return map;
}

/**
 * 设置cookie
 */
exports.stringify = function(cookie){
	//cookie值
	var buffer = [cookie.key,"=",cookie.value];
	//过期时间
	if(cookie.expires){
		buffer.push(" expires=",(new Date(cookie.expires)).toUTCString(),";");
	}
	//路径
	if(cookie.path){
		buffer.push(" path=",cookie.path,";");
	}
	//域
	if(cookie.domain){
		buffer.push(" domain=",cookie.domain,";");
	}
	//安全
	if(cookie.secure){
		buffer.push(" secure",";");
	}
	//仅Http
	if(cookie.httpOnly){
		buffer.push(" httpOnly");
	}
	
	return buffer.join("");
}
