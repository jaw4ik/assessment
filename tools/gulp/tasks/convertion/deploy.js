var gulp = require('gulp'),
del = require('del'),
args = require('yargs').argv;

var $ = require('gulp-load-plugins')({
    lazy: true
});

var outputConvertionServer = args.outputConvertion || 'D:/Applications/convertion';

gulp.task('clean-convertion-server', function (callback) {
    del([outputConvertionServer], { force: true }, callback);
});

gulp.task('run-ut-convertion-server', ['install-npm-modules-convertion-server'], function () {
    return gulp.src('./sources/easygenerator.ConvertionServer/test/*.spec.js')
        .pipe($.mocha({ reporter: 'nyan' }));
});

gulp.task('copy-convertion-server', ['run-ut-convertion-server'], function () {
    var files = [
        './sources/easygenerator.ConvertionServer/package.json',
        './sources/easygenerator.ConvertionServer/www.js',
        './sources/easygenerator.ConvertionServer/server.js',
        './sources/easygenerator.ConvertionServer/ticketController.js',
        './sources/easygenerator.ConvertionServer/ticketDispatcher.js',
        './sources/easygenerator.ConvertionServer/fileController.js',
        './sources/easygenerator.ConvertionServer/config.js',
        './sources/easygenerator.ConvertionServer/iisnode.yml',
        './sources/easygenerator.ConvertionServer/audio_image.jpg',
        './sources/easygenerator.ConvertionServer/converter/*.*',
        './sources/easygenerator.ConvertionServer/Web.config'
    ];

    return gulp.src(files, { base: "./sources/easygenerator.ConvertionServer/" })
        .pipe(gulp.dest(outputConvertionServer));
});

gulp.task('install-npm-modules-convertion-server', function () {
    return gulp.src(['./sources/easygenerator.ConvertionServer/package.json'])
        .pipe($.install());
});

gulp.task('deploy-convertion-server', ['clean-convertion-server', 'copy-convertion-server'], function () {
    return gulp.src([outputConvertionServer + '/package.json'])
        .pipe($.install());
});



