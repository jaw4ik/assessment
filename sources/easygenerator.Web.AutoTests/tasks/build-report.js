var exec = require('child_process').exec;

module.exports = (() => {
    const options = require('../wdio.conf.js').config.reporterOptions;
    if (!options || !options.allure || !options.allure.outputDir) {
        return;
    }
    const allureResultsDir = options.allure.outputDir;
    var result = exec(`allure generate ${allureResultsDir} && allure report open`);
    result.stdout.pipe(process.stdout);
    result.stderr.pipe(process.stderr);
    return result;
})();
