import gulp from 'gulp';
import runSequence from 'run-sequence';
import buildUtilsModule from '../build-utils';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../../config';

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

gulp.task('run-jasmine-tests', $.shell.task([
    '"tools/grunt/node_modules/.bin/grunt" jasmine --gruntfile=tools/grunt/gruntfile.js'
], {
    maxBuffer: 64 * 1024 * 1024
}));

gulp.task('run-unit-tests', function (cb) {
    runSequence('run-server-tests', 'run-jasmine-tests', cb);
});