var gulp = require('gulp'),
del = require('del'),
args = require('yargs').argv,
runSequence = require('run-sequence'),
buildUtils = require('../build-utils')();

var outputDirectory = args.output || 'D:/Applications/easygenerator.StorageServer',
    instance = args.instance || 'Release';

gulp.task('build-storage-project', function () {
    return buildUtils.buildProjects(['./sources/easygenerator.StorageServer/easygenerator.StorageServer.csproj'], outputDirectory + '/bin', outputDirectory);
});

gulp.task('build-storage-web-config', function () {
    return buildUtils.transformWebConfig('./tools/StorageConfigTransform/Transform.proj', './tools/StorageConfigTransform', instance);
});

gulp.task('build-storage-unit-tests', function () {
    return buildUtils.buildProjects(['./sources/easygenerator.StorageServer.Tests/easygenerator.StorageServer.Tests.csproj']);
});

gulp.task('run-storage-server-tests', function () {
    return buildUtils.runUnitTests(['./sources/easygenerator.StorageServer.Tests/bin/Debug/easygenerator.StorageServer.Tests.dll']);
});

gulp.task('build-storage-server', function (cb) {
    runSequence('clean', 'build-storage-project', 'build-storage-unit-tests', 'build-storage-web-config', cb)
});

gulp.task('deploy-storage-server-web-config', function () {
    return buildUtils.moveWebConfig('./tools/StorageConfigTransform/' + instance + '.config', outputDirectory);
});

gulp.task('remove-storage-server-extra-files', function (cb) {
    del([outputDirectory + '/*.Debug.config',
        outputDirectory + '/*.Release.config',
        outputDirectory + '/packages.config',
        outputDirectory + '/bin/*.config',
        outputDirectory + '/bin/*.xml',
        outputDirectory + '/**/*.pdb',
		outputDirectory + '/*.md',
        outputDirectory + '/apple-touch-icon*',
        outputDirectory + '/humans.txt',
        'tools/StorageConfigTransform/' + instance + '.config'], { force: true }, cb);
});

gulp.task('deploy-storage-server', function (cb) {
    runSequence('build-storage-server', 'deploy-storage-server-web-config',
        'remove-storage-server-extra-files', 'run-storage-server-tests', cb);
});