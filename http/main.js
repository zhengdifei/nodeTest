/**
 * http://usejsdoc.org/
 */
var server = require('./server');
var route = require('./route');
var requestHandler = require('./requestHandler');

var handle = [];
handle['/'] = requestHandler.home;
handle['/about'] = requestHandler.about;

server.start(route.route,handle);