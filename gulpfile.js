var
    gulp = require('gulp'),
    merge = require('merge-stream'),

    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs');
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