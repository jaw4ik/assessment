'use strict';

var Launcher = require('./launcher');

// browsers for autotests
const browserName = process.env.browserName;
if (browserName) {
    let browsers = browserName.split(',');
    let capabilities = [];
    for (let browser of browsers) {
        let capability = {
            maxInstances: process.env.maxInstances ? parseInt(process.env.maxInstances) : 2,
            browserName: browser
        }
        if (browser === 'internet explorer') {
            capability.nativeEvents = false;
        }
        capabilities.push(capability);
    }
    process.env.capabilities = JSON.stringify(capabilities);
}

var launcher = new Launcher();
launcher.run();