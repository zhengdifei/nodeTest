var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var client = new kafka.Client("192.168.240.3:2181,192.168.240.4:2181,192.168.240.2:2181/kafka/q-t0wrfv9r");
//var topics = [{topic:'sensorData',partition:0}];
var topics = [{topic:'test3',partition:0}];
var options = {autoCommit:false,fetchMaxWaitMs:1000,fetchMaxBytes:1024*1024};

var consumer = new Consumer(client,topics,options);
var offset = new Offset(client);

consumer.on('message',function(message){
	console.log(message);
});

consumer.on('error',function(err){
	console.log(err);
});

consumer.on('offsetOutRange',function(topic){
	topic.maxNum = 2;
	offset.fetch([topic],function(err,offsets){
		var min = Math.min.apply(null,offsets[topic.topic][topic.partition]);
		consumer.setOffset(topic.topic,topic.partition, min);
	});
});