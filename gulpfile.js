/// <vs AfterBuild='analyze, css' SolutionOpened='watch' />
var
    gulp = require('gulp'),
    path = require('path'),
    merge = require('merge-stream'),

    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),

    less = require('gulp-less'),
    css = require("gulp-minify-css"),
    csso = require('gulp-csso')
;

require('jshint-stylish');

gulp.task('analyze', function () {
    var paths = ['./src/app/**/*.js'];

    var jshint = analyzejshint(paths);
    var jscs = analyzejscs(paths);
    return merge(jshint, jscs);
});

function analyzejshint(sources) {
    return gulp
        .src(sources)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
}

function analyzejscs(sources) {
    return gulp
        .src(sources)
        .pipe(jscs('.jscsrc'));
}


gulp.task('css', function () {
    gulp.src(['./src/css/fonts/fonts.less','./src/css/styles.less'])
       .pipe(less())
       .pipe(css())
       .pipe(csso())
       .pipe(gulp.dest('./src/css/'));
});


gulp.task('watch', function () {
    gulp.watch('./src/css/*', ['css']);

});