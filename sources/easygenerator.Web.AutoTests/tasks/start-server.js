var exec = require('child_process').exec;

var webResult = exec('call start-web-server.bat.lnk');
webResult.stdout.pipe(process.stdout);
webResult.stderr.pipe(process.stderr);

var storageResult = exec('call start-storage-server.bat.lnk');
storageResult.stdout.pipe(process.stdout);
storageResult.stderr.pipe(process.stderr);

var publicationResult = exec('call start-publication-server.bat.lnk');
publicationResult.stdout.pipe(process.stdout);
publicationResult.stderr.pipe(process.stderr);