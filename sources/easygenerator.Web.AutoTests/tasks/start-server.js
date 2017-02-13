var exec = require('child_process').exec;
var co = require('co');

co((function*() {
    yield execCommand('call start-storage-server.bat.lnk');
    yield execCommand('call start-web-server.bat.lnk');
    yield execCommand('call start-publication-server.bat.lnk');
})());

function execCommand(command){
    return new Promise(resolve => {
        setTimeout(() => {
            var result = exec(command);
            result.stdout.pipe(process.stdout);
            result.stderr.pipe(process.stderr);
            resolve();
        }, 500);
    });
}