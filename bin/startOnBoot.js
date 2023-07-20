var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name:'ModaMedic Server',
    description: 'Server',
    script: 'C:\\Users\\User\\Desktop\\Server-2023\\bin\\www'
});

// Listen for the "install" event, which indicates the process is available as a service.
svc.on('install',function(){
    svc.start();
});

svc.on('uninstall',function () {
    svc.stop();
});

svc.install();
// svc.uninstall(); // change to this when want to REMOVE task and run locally


