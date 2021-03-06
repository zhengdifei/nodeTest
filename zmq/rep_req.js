/*
 *
 * One responseder two requesters
 *
 */

var cluster = require('cluster')
  , zmq = require('zmq')
  , port = 'tcp://127.0.0.1:12345';

if (cluster.isMaster) {
  for (var i = 0; i < 2; i++) cluster.fork();

  cluster.on('death', function(worker) {
      console.log('worker ' + worker.pid + ' died');
  });
  
  //responseder = server
  
  var socket = zmq.socket('rep');

  socket.identity = 'server' + process.pid;

  socket.bind(port, function(err) {
    if (err) throw err;
    console.log('bound!');

    socket.on('message', function(data) {
      console.log(socket.identity + ': received ' + data.toString());
      socket.send(2 * data);
    });
  });
} else {
  //requester = client
  
  var socket = zmq.socket('req');

  socket.identity = 'client' + process.pid;
  
  socket.connect(port);
  console.log('connected!');

  setInterval(function() {
    var value = Math.floor(Math.random()*100);
      
    socket.send(value);
    console.log(socket.identity + ': asking ' + value);
  }, 100);

  socket.on('message', function(data) {
    console.log(socket.identity + ': answer data ' + data);
  });
}