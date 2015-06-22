var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    lazy: true
});

var config = {
    less: {
        src: ['./sources/easygenerator.Web/Content/**/*.less'],
        dest: './sources/easygenerator.Web/Content'
    }
}


gulp.task('watch', function () {
    gulp.watch('./css/*', ['styles']);
});

gulp.task('styles', function () {
    return gulp.src(config.less.src)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error);
                this.emit('end');
            }
        }))
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 1 Chrome version', 'last 1 Firefox version', 'last 1 Explorer version', 'last 1 Safari version'],
            cascade: false
        }))
        .pipe(gulp.dest(config.less.dest));
});
