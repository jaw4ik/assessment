/// <vs AfterBuild='analyze, build' SolutionOpened='watch' />
var
    gulp = require('gulp'),
    path = require('path'),
    merge = require('merge-stream'),
    eventStream = require('event-stream'),

    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),

    less = require('gulp-less'),
    css = require("gulp-minify-css"),
    csso = require('gulp-csso'),
    webserver = require('gulp-webserver'),

    uglify = require('gulp-uglify'),


    gulpif = require('gulp-if'),
    useref = require('gulp-useref'),

    replace = require('gulp-replace'),
    del = require('del'),

    bower = require('gulp-bower'),

    output = './.output',
    buildVersion = +new Date()
    ;

require('jshint-stylish');

function addBuildVersion() {
    return eventStream.map(function (file, callback) {
        var filePath = file.history[0];
        if (filePath && filePath.match(/\.(js)$/gi)) {
            callback(null, file);
            return;
        }
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\?|\&)v=([0-9]+)/gi, '') // remove build version
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([?])/gi, '.$1?v=' + buildVersion + '&') // add build version to resource with existing query param
            .replace(/\.(jpeg|jpg|png|gif|css|js|html|eot|svg|ttf|woff)([\s\"\'\)])/gi, '.$1?v=' + buildVersion + '$2') // add build version to resource without query param
            .replace(/urlArgs: 'v=buildVersion'/gi, 'urlArgs: \'v=' + buildVersion + '\''); // replace build version for require config
        file.contents = new Buffer(fileContent);
        callback(null, file);
    });
};

function removeDebugBlocks() {
    return eventStream.map(function (file, callback) {
        var fileContent = String(file.contents);
        fileContent = fileContent
            .replace(/(\/\* DEBUG \*\/)([\s\S])*(\/\* END_DEBUG \*\/)/gmi, '') // remove all code between '/* DEBUG */' and '/* END_DEBUG */' comment tags
            .replace(/(\/\* RELEASE)|(END_RELEASE \*\/)/gmi, ''); // remove '/* RELEASE' and 'END_RELEASE */' tags to uncomment release code
        file.contents = new Buffer(fileContent);
        callback(null, file);
    });
};

gulp.task('analyze', function () {
    var paths = ['./src/app/**/*.js', './src/settings/js/settings.js'];

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

gulp.task('watch', function () {
    gulp.watch('./src/css/*', ['css']);
});

gulp.task('build', ['pre-build', 'build-app', 'build-settings', 'build-searchcontent-app'], function () {
});

gulp.task('clean', function (cb) {
    del([output], cb);
});

gulp.task('bower', ['clean'], function () {
    return bower({ cmd: 'update' });
});

gulp.task('css', ['clean', 'bower'], function () {
    return gulp.src(['./src/css/font/fonts.less', './src/css/styles.less'])
        .pipe(less())
        .pipe(css())
        .pipe(csso())
        .pipe(gulp.dest('./src/css/'));
});

gulp.task('assets', ['clean', 'bower'], function () {
    gulp.src('./src/vendor/easygenerator-plugins/dist/font/**')
        .pipe(gulp.dest(output + '/css/font'));
    gulp.src('./src/vendor/easygenerator-plugins/dist/img/**')
        .pipe(gulp.dest(output + '/css/img'));
});

gulp.task('pre-build', ['clean', 'bower', 'css', 'assets'], function () {
});

gulp.task('build-app', ['pre-build'], function () {
    var assets = useref.assets();

    return merge(

        gulp.src('./src/index.html')
            .pipe(assets)
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', css()))
            .pipe(assets.restore())
            .pipe(useref())
            .pipe(addBuildVersion())
            .pipe(gulp.dest(output)),

        gulp.src(['./src/css/font/**', '!./src/css/font/*.less'])
            .pipe(gulp.dest(output + '/css/font')),

        gulp.src(['./src/css/img/**'])
            .pipe(gulp.dest(output + '/css/img')),

        gulp.src(['./src/css/*.css'])
            .pipe(gulp.dest(output + '/css')),

        gulp.src(['./src/preview/**'])
            .pipe(gulp.dest(output + '/preview')),

        gulp.src(['./src/app/views/**/*.html'])
            .pipe(gulp.dest(output + '/app/views')),

        gulp.src(['./src/app/modules/xApi/views/**/*.html'])
            .pipe(gulp.dest(output + '/app/modules/xApi/views')),

        gulp.src('./src/manifest.json')
            .pipe(gulp.dest(output)),

        gulp.src(['./src/settings.js'])
            .pipe(gulp.dest(output)),

        gulp.src(['./src/publishSettings.js'])
            .pipe(gulp.dest(output)),

        gulp.src(['./src/lang/*.json'])
            .pipe(gulp.dest(output + '/lang'))
        );
});

gulp.task('build-settings', ['build-design-settings', 'build-configure-settings'], function () {
    gulp.src('./src/settings/api.js')
        .pipe(removeDebugBlocks())
        .pipe(uglify())
        .pipe(gulp.dest(output + '/settings'));

});

gulp.task('build-design-settings', ['pre-build'], function () {
    var assets = useref.assets();

    gulp.src(['./src/settings/design/branding.html', './src/settings/design/layout.html'])
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output + '/settings/design'));

    gulp.src('./src/settings/design/css/fonts/**')
        .pipe(gulp.dest(output + '/settings/design/css/fonts'));

    gulp.src('./src/settings/design/css/design.css')
        .pipe(css())
        .pipe(gulp.dest(output + '/settings/design/css'));

});

gulp.task('build-configure-settings', ['pre-build'], function () {
    var assets = useref.assets();

    gulp.src(['./src/settings/configure/configure.html'])
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output + '/settings/configure'));

    gulp.src('./src/settings/configure/img/**')
        .pipe(gulp.dest(output + '/settings/configure/img'));

    gulp.src('./src/settings/configure/css/img/**')
        .pipe(gulp.dest(output + '/settings/configure/css/img'));

    gulp.src('./src/settings/configure/css/fonts/**')
        .pipe(gulp.dest(output + '/settings/configure/css/fonts'));

    gulp.src('./src/settings/configure/css/configure.css')
        .pipe(css())
        .pipe(gulp.dest(output + '/settings/configure/css'));

});

gulp.task('build-searchcontent-app', ['pre-build'], function () {
    var assets = useref.assets();

    gulp.src('./src/searchcontent/index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', css()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(addBuildVersion())
        .pipe(gulp.dest(output + '/searchcontent'));
});

gulp.task('webserver', function () {
    gulp.src('.')
        .pipe(webserver({
            livereload: {
                enable: true,
                filter: function (fileName) {
                    return !fileName.match(/.css/);
                }
            },
            directoryListing: true,
            open: "src/index.html"
        }));
});

