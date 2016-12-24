import gulp from 'gulp';
import runSequence from 'run-sequence';
import buildUtilsModule from '../build-utils';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../../config';
import fileUrl from 'file-url';
import phantom from 'phantom';
import co from 'co';
import { exec } from 'child_process';

var buildUtils = buildUtilsModule();
var $ = gulpLoadPlugins({
    lazy: true
});

gulp.task('run-server-tests', function () {
    return buildUtils.runUnitTests([
        './sources/easygenerator.DomainModel.Tests/bin/Release/easygenerator.DomainModel.Tests.dll',
        './sources/easygenerator.DataAccess.Tests/bin/Release/easygenerator.DataAccess.Tests.dll',
        './sources/easygenerator.Infrastructure.Tests/bin/Release/easygenerator.Infrastructure.Tests.dll',
        './sources/easygenerator.Web.Tests/bin/Release/easygenerator.Web.Tests.dll'
    ]);
});

gulp.task('run-jasmine-tests', () => {
    return execute(fileUrl('./sources/easygenerator.Web/specs.html'))
});

gulp.task('run-unit-tests', function (cb) {
    runSequence('run-server-tests', 'run-jasmine-tests', cb);
});

gulp.task('run-auto-tests', function () {
	process.chdir('sources/easygenerator.Web.AutoTests');
    return gulp.src('wdio.conf.js').pipe(require('../../../../sources/easygenerator.Web.AutoTests/node_modules/gulp-webdriver')({}));
});

gulp.task('auto-tests', ['run-auto-tests'], function() {
	return exec('allure generate ./allure-results && allure report open').stdout.pipe(process.stdout);
});

const execute = url => new Promise((resolve, reject) => {
    const constants = {
        JASMINE_STARTED: 'jasmine.jasmineStarted',
        SPEC_STARTED: 'jasmine.specStarted',
        SPEC_DONE: 'jasmine.specDone',
        JASMINE_DONE: 'jasmine.jasmineDone',

        timeout: 5 * 60 * 1000
    };

    let instance, page;

    co(function* () {
        instance = yield phantom.create(['--load-images=false']);

        page = yield instance.createPage();

        if ((yield page.open(url)) !== 'success') {
            throw `Unable to open ${url}`;
        }

        yield new Promise((resolve, reject) => {
            let count = 0, failed = 0;

            let fallbackId = setTimeout(() => {
                reject(`Jasmine specs were not started within a given period of time (${constants.timeout}ms)`)
            }, constants.timeout)

            page.on('onFilePicker', () => console.warn('A file picker dialog was opened by one of the specs.'));
            page.on('onResourceRequested', request => {
                if (request.url.indexOf('/api/') > 0) {
                    console.warn(`A request to the API was started by one of the specs. (${request.url})`)
                }
                if (request.url.indexOf('/fonts.googleapis.com/') > 0) {
                    console.warn(`A request to the Google Fonts API was started by one of the specs. (${request.url})`)
                }
            });
            page.on('onAlert', message => {
                let payload = JSON.parse(message);
                let eventName = payload[0];
                let result = payload[1];

                if (eventName === constants.JASMINE_STARTED) {
                    console.log('Specs have started...')
                    clearTimeout(fallbackId);
                }

                if (eventName === constants.SPEC_STARTED) {
                    count++;
                }
                if (eventName === constants.SPEC_DONE) {
                    if (result.status !== 'passed') {
                        failed++;
                        console.error(`${result.fullName}
                            \r\t\r\t${result.failedExpectations.map(e => e.message)}
                        `);
                    }
                }
                if (eventName === constants.JASMINE_DONE) {
                    console.log('Specs have finished...')
                    if (failed === 0) {
                        resolve(0);
                    } else {
                        reject(`${failed} of ${count} specs have(s) failed!`);
                    }
                }
            });
        });
    }).then(() => {
        page.close
        instance.exit();

        resolve();
    }).catch(reason => {
        reject(reason);
        instance && instance.exit();
    });
});