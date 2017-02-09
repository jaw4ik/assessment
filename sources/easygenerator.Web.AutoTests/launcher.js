'use strict';

const WDIO_CONF_PATH = './wdio.conf.js';

var co = require('co');
var fs = require('fs');
var del = require('del');
var WdioLauncher = require('webdriverio').Launcher;
var dataManager = require('./data/dataManager');

var wdio = new WeakMap();
var wdioConfig = new WeakMap();

class Launcher {
    constructor(opts) {
        wdioConfig.set(this, require(WDIO_CONF_PATH));
        wdio.set(this, new WdioLauncher(WDIO_CONF_PATH, opts));
    }
    run(_continue) {
        this.removeResults();
        this.removeErrorShots();
        this.removeSeleniumLogs();
        return co(dataManager.prepare()).then(() => {
            return wdio.get(this).run().then(code => {
                console.log(`process exited with code ${code}`);
                _continue || process.exit(0);
            }, err => {
                console.error('Launcher have failed to start the test', err.stacktrace);
                _continue || process.exit(1);
            });
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
    removeSeleniumLogs() {
        const logsPath = wdioConfig.get(this).config.seleniumLogs;
        if (!logsPath) {
            return;
        }
        del.sync([`${logsPath}/**`]);
    }
};

module.exports = Launcher;