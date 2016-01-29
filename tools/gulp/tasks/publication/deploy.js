import gulp from 'gulp';
import yargs from 'yargs';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import buildUtilsModule from '../build-utils';

var buildUtils = buildUtilsModule();
var args = yargs.argv;
var outputDirectory = args.output || 'D:/Applications/easygenerator.PublicationServer',
    instance = args.instance || 'Release';

gulp.task('build-publication-project', function () {
    return buildUtils.buildProjects(['./sources/easygenerator.PublicationServer.Web/easygenerator.PublicationServer.Web.csproj'], outputDirectory + '/bin', outputDirectory);
});

gulp.task('build-publication-web-config', function () {
    return buildUtils.transformWebConfig('./tools/WebConfigTransform/PublicationServerTransform.proj', './tools/WebConfigTransform', instance);
});

gulp.task('build-publication-unit-tests', function () {
    return buildUtils.buildProjects(['./sources/easygenerator.PublicationServer.Tests/easygenerator.PublicationServer.Tests.csproj']);
});

gulp.task('run-publication-server-tests', function () {
    return buildUtils.runUnitTests(['./sources/easygenerator.PublicationServer.Tests/bin/Debug/easygenerator.PublicationServer.Tests.dll']);
});

gulp.task('build-publication-server', function (cb) {
    runSequence('clean', 'build-publication-project', 'build-publication-unit-tests', 'build-publication-web-config', cb)
});

gulp.task('deploy-publication-server-uploaded-packages-folder', function (cb) {
    buildUtils.createDirectory(cb, outputDirectory + '/UploadedPackages');
});

gulp.task('deploy-publication-server-courses-folder', function (cb) {
    buildUtils.createDirectory(cb, outputDirectory + '/courses');
});

gulp.task('deploy-publication-server-web-config', function () {
    return buildUtils.moveWebConfig('./tools/WebConfigTransform/PublicationServer-' + instance + '.config', outputDirectory);
});

gulp.task('remove-publication-server-extra-files', function (cb) {
    del([outputDirectory + '/*debug.config',
        outputDirectory + '/*release.config',
        outputDirectory + '/packages.config',
        outputDirectory + '/bin/*.config',
        outputDirectory + '/bin/*.xml',
        outputDirectory + '/**/*.pdb',
        outputDirectory + '/**/*spec.js',
        outputDirectory + '/apple-touch-icon*',
        outputDirectory + '/Scripts/*.map',
        outputDirectory + '/humans.txt',
        outputDirectory + '/Content/*.less',
        outputDirectory + '/Scripts/jasmine',
        'tools/WebConfigTransform/PublicationServer-' + instance + '.config'], { force: true }, cb);
});

gulp.task('deploy-publication-server', function (cb) {
    runSequence('build-publication-server', 'deploy-publication-server-uploaded-packages-folder', 'deploy-publication-server-courses-folder', 'deploy-publication-server-web-config',
        'remove-publication-server-extra-files', 'run-publication-server-tests', cb);
});