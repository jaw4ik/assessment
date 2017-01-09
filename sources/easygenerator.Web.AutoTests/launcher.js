'use strict';

const WDIO_CONF_PATH = './wdio.conf.js';

var fs = require('fs');
var del = require('del');
var WdioLauncher = require('webdriverio').Launcher;

var wdio = new WeakMap();
var wdioConfig = new WeakMap();

class Launcher {
    constructor(opts) {
        wdioConfig.set(this, require(WDIO_CONF_PATH));
        wdio.set(this, new WdioLauncher(WDIO_CONF_PATH, opts));
    }
    run() {
        this.removeResults();
        this.removeErrorShots();

        return wdio.get(this).run().then(code => {
            console.log(`process exited with code ${code}`);
            process.exit(0);
        }, err => {
            console.error('Launcher have failed to start the test', err.stacktrace);
            process.exit(1);
        });
    }
    removeResults() {
        const options = wdioConfig.get(this).config.reporterOptions;
        if (!options || !options.allure || !options.allure.outputDir) {
            return;
        }
        const allureResultsDir = options.allure.outputDir;
        del.sync([`${allureResultsDir}/**`, 'allure-report/**']);
    }
    removeErrorShots() {
        const errorShotsPath = wdioConfig.get(this).config.screenshotPath;
        if (!errorShotsPath) {
            return;
        }
        del.sync([`${errorShotsPath}/**`]);
        fs.mkdirSync(errorShotsPath);
    }
};

module.exports = Launcher;