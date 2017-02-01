var exec = require('child_process').exec;

var result = exec('call start-web-server.bat.lnk');
result.stdout.pipe(process.stdout);
result.stderr.pipe(process.stderr);