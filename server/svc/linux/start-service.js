var Service = require('node-linux').Service;

// Create a new service object
var svc = new Service({
	name:'Vandelay',
	script:'../../server.js',
});

// Listen for the start event, which indicates that the process has started.
svc.on('start',function(){
	console.log("Service Started.");
});

svc.start();
