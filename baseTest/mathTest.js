var t1 = Math.round(10*Math.random());
console.log(t1);

function twoDecima(num,precision){
	var regeStr = "/([0-9]+.[0-9]{"+ precision +"})[0-9]*/";
	var rege = eval(regeStr);///([0-9]+.[0-9]{1})[0-9]*/;
	return num.toString().replace(rege,"$1");
}

console.log(twoDecima(50.00+ Math.random(),1));

var time1 = Date.now();

var date = new Date( time1 - 365*24*60*60*1000);//.转换成毫秒
var time2 = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) ;

console.log(time2);