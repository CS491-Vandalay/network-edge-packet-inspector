var Service = require('node-linux').Service;

// Create a new service object
var svc = new Service({
	name:'Vandelay',
	description: 'Vandelay-Inspector',
	script:'../server.js',
});

// Listen for the install event, which indicates that the process is available as a service.
svc.on('install',function(){
	svc.start();
});

svc.install();
