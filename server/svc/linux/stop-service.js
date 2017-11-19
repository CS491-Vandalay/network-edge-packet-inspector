var Service = require('node-linux').Service;

// Create a new service object
var svc = new Service({
	name:'Vandelay',
	script:'../../server.js',
});

// Listen for the stop event, which indicates that the process has stopped.
svc.on('stop',function(){
	console.log("Service stopped.");
});

svc.stop();
