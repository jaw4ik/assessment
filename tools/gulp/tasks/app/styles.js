import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../../config';

var $ = gulpLoadPlugins({
    lazy: true
});

gulp.task('styles', function () {
    return gulp.src(config.less.src)
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
            browsers: config.less.browsers,
            cascade: false
        }))
        .pipe(gulp.dest(config.less.dest));
});

gulp.task('watch', ['styles'], function () {
    gulp.watch(config.less.src, ['styles']);
});