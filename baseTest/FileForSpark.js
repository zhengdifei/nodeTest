//writeFile写入文件(filename,data,[options(encoding,mode,flag)],callback)
//flag:r-读取文件，w-写入文件，a-追加写入文件
var fs = require("fs");

function sleep(sleepTime) {
    for(var start = +new Date; +new Date - start <= sleepTime; ) { } 
}

while(true){
	var filename = "test" + Date.now()+".txt";
	
	var charArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];

	var num = Math.round(1 + 5*Math.random());
	var str = '';
	for(var i =0;i<num;i++){
		str += charArray[Math.round(33*Math.random())]+" ";
	}
	
	fs.writeFileSync('D:/project_room/scalaWorkspace/scalaMavenTest/test/file/'+filename,str,{'flag':'w'},function(err){
		if(err){
			throw err;
		}
		console.log('saved.');
	});
	
	sleep(1000);
}
