var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    config = require('../../config'),
    buildUtils = require('../build-utils')();

var $ = require('gulp-load-plugins')({
    lazy: true
});

gulp.task('run-server-tests', function () {
    return buildUtils.runUnitTests([
        './sources/easygenerator.DomainModel.Tests/bin/Debug/easygenerator.DomainModel.Tests.dll',
        './sources/easygenerator.DataAccess.Tests/bin/Debug/easygenerator.DataAccess.Tests.dll',
        './sources/easygenerator.Infrastructure.Tests/bin/easygenerator.Infrastructure.Tests.dll',
        './sources/easygenerator.Web.Tests/bin/Debug/easygenerator.Web.Tests.dll'
    ]);
});

gulp.task('run-jasmine-tests', $.shell.task([
    '"tools/grunt/node_modules/.bin/grunt" jasmine --gruntfile=tools/grunt/gruntfile.js'
], {
    maxBuffer: 64 * 1024 * 1024
}));

gulp.task('run-unit-tests', function (cb) {
    runSequence('run-server-tests', 'run-jasmine-tests', cb);
});