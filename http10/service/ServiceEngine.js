var db = require('../config/database');
var ModelMap = require('../model/ModelMap');

function ServiceEngine(ep,callback){

	this.initInterceptor = function(order){
		this.interceptors = [];
		this.offset = -1;

		var command = ep['command'];
		var _inters = ModelMap[ep['command']][order] || [];

		for(var i = 0;i<_inters.length;i++){
			var _interClass = require(_inters[i]);
			this.interceptors.push(new _interClass());
		}
	};

	this.handle = function(sqlObj,paramMap){
		var sql = "";
		if(typeof sqlObj == 'string'){
			sql = sqlObj;
		}else if(typeof sqlObj == 'object' && typeof sqlObj['sql'] == 'string'){
			sql = sqlObj['sql'];
		}
		var rege = /#[a-zA-Z0-9_]+#/gi;
		var paramArr = sql.match(rege);
		if(paramArr != null && paramArr.length != 0){
			for(var i = 0;i<paramArr.length;i++){
				var paramName = paramArr[i];
				var paramValue = paramMap[paramName.substring(1,paramName.length-1)];
				if(/^\d+$/.test(paramValue)){
					sql = sql.replace(paramName,paramValue);
				}else{
					sql = sql.replace(paramName,'\''+paramValue+'\'');
				}
			}
		}
		console.log(sql);
		return sql;
	};

	this.execute = function(order) {
		var me = this;
		console.log('execute start');
		if(this.interceptors == null){
			this.initInterceptor(order);
		}
		this.offset++;

		if (this.interceptors != null && this.offset < this.interceptors.length) {
			this.interceptors[this.offset]['intercept'](this,ep);
		}

		if(order == 'before'){
			console.log('serviceEngine execute');
			db.pool.getConnection(function(err,connection){
				if(err){
					callback(true,ep);
					return;
				}
				
				connection.query(me.handle(ModelMap[ep['command']],ep['paramMap']),function(err,result){
					if(err){
						callback(true,ep);
						return;
					}
					ep['resultMap']['data'] = result;
					
					me.interceptors = null;
					me.execute('after');
				});
			});
			console.log('serviceEngine execute end');
		}else if(order == 'after'){
			callback(false,ep);
		}
	};	

	/** 初始化操作区 */
	this.Constructor = function() {// 构造方法
		//初始化
		this.execute('before');
	}

	this.Constructor();
}

module.exports = ServiceEngine;