'use strict';

var WdioLauncher = require('webdriverio').Launcher;
const WDIO_CONF_PATH = './wdio.conf.js';
var wdio = new WeakMap();

class Launcher {
    constructor(opts) {
        wdio.set(this, new WdioLauncher(WDIO_CONF_PATH, opts));
    }
    run() {
        return wdio.get(this).run().then(code => {
            process.exit(code);
        }, err => {
            console.error('Launcher have failed to start the test', err.stacktrace);
            process.exit(1);
        });
    }
};

module.exports = Launcher;