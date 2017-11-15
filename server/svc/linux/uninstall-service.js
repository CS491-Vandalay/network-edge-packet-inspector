var Service = require('node-linux').Service;

// Create a new service object
var svc = new Service({
	name:'Vandelay',
	script:'../server.js'
});

// Listen for the uninstall event so we know when its done.
svc.on('uninstall',function(){
	console.log("Uninstall complete.");
	console.log("The server exists: ", svc.exists());
});

svc.uninstall();
