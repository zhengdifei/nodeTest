var kafka = require('kafka-node');
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var client = new kafka.Client("192.168.240.3:2181,192.168.240.4:2181,192.168.240.2:2181/kafka/q-t0wrfv9r");
var producer = new Producer(client,{requireAcks:1});

producer.on('ready',function(){
	var message = 'a message';
	var keyedMessage = new KeyedMessage('keyed','a keyed message');

	producer.send([{topic:'test3',partition:0,messages:[message,keyedMessage],attributes:0}],function(err,result){
		console.log(err || result);
		//process.exit();
	});
});

producer.on('error',function(err){
	console.log(err);
});

