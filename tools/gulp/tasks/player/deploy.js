import gulp from 'gulp';
import del from 'del';
import yargs from 'yargs';
import runSequence from 'run-sequence';
import buildUtilsModule from '../build-utils';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../../config';

var args = yargs.argv;
var buildUtils = buildUtilsModule();
var $ = gulpLoadPlugins({
    lazy: true
});

var outputPlayer = args.outputPlayer || 'D:/Applications/player';

gulp.task('deploy-player', ['assets-player'], function () {
    var assets = $.useref.assets();
    gulp.src('./sources/easygenerator.Player/views/*.jade')
        .pipe(assets)
        .pipe($.if('*.css', $.minifyCss()))
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.jadeUsemin({
            js: [$.uglify()]
        }))
        .pipe(buildUtils.addBuildVersion())
        .pipe(gulp.dest(outputPlayer + '/views/'));

    return gulp.src([outputPlayer + '/package.json'])
        .pipe($.install({ production: true }));
});

gulp.task('clean-player', function (callback) {
    del([outputPlayer], { force: true }, callback);
});

gulp.task('install-bower-modules-player', function () {
    return gulp.src(['./sources/easygenerator.Player/bower.json'])
        .pipe($.install());
});

gulp.task('styles-player', function () {
    return gulp.src(config.less.srcPlayer)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe($.less({
            strictMath: true,
            strictUnits: true
        }))
        .pipe($.autoprefixer({
            browsers: config.less.playerBrowsers,
            cascade: false
        }))
        .pipe(gulp.dest(config.less.destPlayer));
});

gulp.task('copy-player', ['clean-player', 'install-bower-modules-player'], function () {
    var files = [
        './sources/easygenerator.Player/package.json',
        './sources/easygenerator.Player/bower.json',
        './sources/easygenerator.Player/.bowerrc',
        './sources/easygenerator.Player/www.js',
        './sources/easygenerator.Player/app.js',
		'./sources/easygenerator.Player/config.js',
		'./sources/easygenerator.Player/middlewares/*.*',
        './sources/easygenerator.Player/routes/*.*',
        './sources/easygenerator.Player/models/*.*',
        './sources/easygenerator.Player/public/images/*.*',
        './sources/easygenerator.Player/public/favicon.ico',
        './sources/easygenerator.Player/Web.config',
        './sources/easygenerator.Player/iisnode.yml'
    ];

    return gulp.src(files, { base: "./sources/easygenerator.Player/" })
        .pipe(gulp.dest(outputPlayer));
});

gulp.task('assets-player', ['styles-player', 'copy-player'], function () {
    gulp.src([
        './sources/easygenerator.Player/public/styles/style.css',
        './sources/easygenerator.Player/public/styles/video.css',
        './sources/easygenerator.Player/public/styles/audio.css'
    ])
        .pipe($.minifyCss())
        .pipe(gulp.dest(outputPlayer + '/public/styles/'));
    gulp.src('./sources/easygenerator.Player/public/vendor/video.js/dist/font/*.*')
        .pipe(gulp.dest(outputPlayer + '/public/styles/font'));
    gulp.src('./sources/easygenerator.Player/public/styles/template/*.*')
        .pipe(gulp.dest(outputPlayer + '/public/styles/template'));
    return gulp.src('./sources/easygenerator.Player/public/vendor/video.js/dist/lang/*.*')
        .pipe(gulp.dest(outputPlayer + '/public/js/lang/'));
});
