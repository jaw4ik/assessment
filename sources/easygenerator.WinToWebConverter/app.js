'use strict';

var app = require('./server');
var config = require('./config');

let port = process.env.port || 444;
let ip = process.env.ip || '127.0.0.1';

if (config.morgan) {
    app.use(require('morgan')(config.morgan));
}

app.listen(port, ip, () => {
    console.log(`Express server listening on port = ${port}, ip = ${ip}`);
});