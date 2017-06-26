/**
 * http://usejsdoc.org/
 */

var SessionManager = function(timeout){
	
	this.timeout = timeout;
	
	this._sessions = {};
	//设置
	this.set = function(session){
		this._sessions[session.sessionId] = session;
	}
	//获取
	this.get = function(id){
		var session = this._sessions[id];
		if(session != null && new Date().getTime() - session['createTime'] < timeout){
			return session;
		}else{
			this.remove(id);
			return null;
		}
	}
	//删除
	this.remove = function(id){
		delete this._sessions[id];
	}
}

module.exports = SessionManager;