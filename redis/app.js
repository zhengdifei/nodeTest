var redis = require("redis"),
    sub = redis.createClient(), pub = redis.createClient(),client3 = redis.createClient(),
    msg_count = 0;

sub.on("subscribe", function (channel, count) {
    pub.publish("a nice channel", "I am sending a message.");
    pub.publish("a nice channel", "I am sending a second message.");
    pub.publish("a nice channel", "I am sending my last message.");
});

sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
    msg_count += 1;
    if (msg_count === 3) {
        sub.unsubscribe();
        sub.end(true);
        pub.end(true);
    }
});

sub.subscribe("a nice channel");

client3.on("error", function (err) {
    console.log("Error " + err);
});

client3.set("string key", "string val", redis.print);
client3.hset("hash key", "hashtest 1", "some value", redis.print);
client3.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client3.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client3.quit();
});
