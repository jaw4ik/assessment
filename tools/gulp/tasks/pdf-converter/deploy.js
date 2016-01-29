import gulp from 'gulp';
import del from 'del';
import yargs from 'yargs';
import runSequence from 'run-sequence';
import buildUtilsModule from '../build-utils';

var args = yargs.argv;
var buildUtils = buildUtilsModule();

var outputDirectory = args.output || 'D:/Applications/easygenerator.PdfConverter',
    instance = args.instance || 'Release';

gulp.task('build-pdf-converter-project', function () {
    return buildUtils.buildProjects(['./sources/easygenerator.PdfConverter/easygenerator.PdfConverter.csproj'], outputDirectory + '/bin', outputDirectory);
});

gulp.task('build-pdf-converter-web-config', function () {
    return buildUtils.transformWebConfig('./tools/PdfConverterConfigTransform/Transform.proj', './tools/PdfConverterConfigTransform', instance);
});

gulp.task('build-pdf-converter-server', function (cb) {
    runSequence('clean', 'build-pdf-converter-project', 'build-pdf-converter-web-config', cb)
});

gulp.task('deploy-pdf-converter-web-config', function () {
    return buildUtils.moveWebConfig('./tools/PdfConverterConfigTransform/' + instance + '.config', outputDirectory);
});

gulp.task('remove-pdf-converter-extra-files', function (cb) {
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
        'tools/PdfConverterConfigTransform/' + instance + '.config'], { force: true }, cb);
});

gulp.task('deploy-pdf-converter-server', function (cb) {
    runSequence('build-pdf-converter-server', 'deploy-pdf-converter-web-config', 'remove-pdf-converter-extra-files', cb);
});