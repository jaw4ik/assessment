/// <vs AfterBuild='analyze, build' SolutionOpened='watch' />
var
    gulp = require('gulp'),
    path = require('path'),
    merge = require('merge-stream'),

    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),

    less = require('gulp-less'),
    css = require("gulp-minify-css"),
    csso = require('gulp-csso'),

    uglify = require('gulp-uglify'),


    gulpif = require('gulp-if'),
    useref = require('gulp-useref'),

    replace = require('gulp-replace'),
    del = require('del'),

    output = './.output'
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
    gulp.src(['./src/css/fonts/fonts.less', './src/css/styles.less'])
       .pipe(less())
       .pipe(css())
       .pipe(csso())
       .pipe(gulp.dest('./src/css/'));
});


gulp.task('watch', function () {
    gulp.watch('./src/css/*', ['css']);
});


gulp.task('clean', function (cb) {
    del([output], cb);
});

gulp.task('build', ['clean', 'css'], function () {
    var assets = useref.assets();

    return merge(

            gulp.src('./src/index.html')
                .pipe(assets)
                .pipe(gulpif('*.js', uglify()))
                .pipe(gulpif('*.css', css()))
                .pipe(assets.restore())
                .pipe(useref())
                .pipe(replace(/(app\/)(.+).js/gi, '$2.js'))
                .pipe(gulp.dest(output)),

            gulp.src(['./src/css/fonts/**', '!./src/css/fonts/*.less'])
                .pipe(gulp.dest(output + '/css/fonts')),

            gulp.src(['./src/css/img/**'])
                .pipe(gulp.dest(output + '/css/img')),

            gulp.src(['./src/css/*.css'])
                .pipe(gulp.dest(output + '/css')),


            gulp.src(['./src/app/views/**/*.html'])
                .pipe(gulp.dest(output + '/app/views')),

            gulp.src(['./src/content/**/*.*'])
                .pipe(gulp.dest(output + '/content'))
        );

});

