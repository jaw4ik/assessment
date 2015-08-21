
/// <binding ProjectOpened='watch' />
var gulp = require('gulp'),
    del = require('del'),
    args = require('yargs').argv,
    MSTest = require('mstest'),
    Q = require('q');

var $ = require('gulp-load-plugins')({
    lazy: true
});

var config = {
        less: {
            src: ['./sources/easygenerator.Web/Content/**/*.less'],
            dest: './sources/easygenerator.Web/Content',

            browsers: ['last 1 Chrome version', 'last 1 Firefox version', 'last 1 Explorer version', 'last 1 Safari version']
        }
    },
    outputDirectory = args.output || 'D:\\Applications\\easygenerator',
    instance = args.instance || 'Release';

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

gulp.task('clean', function (callback) {
    del([outputDirectory], { force: true }, callback);
});

gulp.task('watch', ['styles'], function () {
    gulp.watch(config.less.src, ['styles']);
});

gulp.task('build-main-project', ['build-web-config'], function () {
    return gulp.src('.\\sources\\easygenerator.Web\\easygenerator.Web.csproj')
        .pipe($.msbuild({
            //stdout: true,
            errorOnFail: true,
            targets: ['Clean', 'Build'],
            maxBuffer: 1024 * 1000,
            toolsVersion: 12.0,
            properties: {
                OutDir: outputDirectory + '\\bin',
                WebProjectOutputDir: outputDirectory,
                DebugSymbols: false,
                DebugType: 'none',
                TreatWarningsAsErrors: true,
                Configuration: 'Release'
            }
        }));
});

gulp.task('build-web-config', function () {
    return gulp.src('.\\tools\\WebConfigTransform\\Transform.proj')
        .pipe($.msbuild({
            //stdout: true,
            targets: ['Transform'],
            errorOnFail: true,
            maxBuffer: 1024 * 1000,
            toolsVersion: 12.0,
            properties: {
                Instance: instance,
                Configuration: 'Release',
                OutputPath: '.\\tools\\WebConfigTransform'
            }
        }));
});

gulp.task('build-unit-tests', ['build-main-project'], function () {
    return gulp.src('.\\sources\\**\\**Tests.csproj')
        .pipe($.msbuild({
            //stdout: true,
            errorOnFail: true,
            maxBuffer: 1024 * 1000,
            toolsVersion: 12.0,
            properties: {
                PreBuildEvent: '',
                PostBuildEvent: '',
                TreatWarningsAsErrors: true
            }
        }));
});

gulp.task('run-nunit-tests', ['build-unit-tests'], function (cb) {
    var testsPath = [
        '.\\sources\\easygenerator.DomainModel.Tests\\bin\\Debug\\easygenerator.DomainModel.Tests.dll',
        '.\\sources\\easygenerator.DataAccess.Tests\\bin\\Debug\\easygenerator.DataAccess.Tests.dll',
        '.\\sources\\easygenerator.Infrastructure.Tests\\bin\\easygenerator.Infrastructure.Tests.dll',
        '.\\sources\\easygenerator.Web.Tests\\bin\\Debug\\easygenerator.Web.Tests.dll'
    ];

    var defer = Q.defer();

    runTest(testsPath.shift(), defer);

    return defer.promise;


    function runTest(path, defer) {
        var msTest = new MSTest();
        msTest.testContainer = path;
        msTest.details.errorMessage = true;
        msTest.details.errorStackTrace = true;
        msTest.runTests({
            eachTest: function (test) {
                console.log(test.status + ' - ' + test.name);
            },
            done: function (results, passed, failed) {
                console.log(passed.length + '/' + results.length);
                var instance = testsPath.shift();
                if (typeof instance !== 'undefined') {
                    runTest(instance, defer);
                } else {
                    defer.resolve();
                }
                
            }
        });
    }
});

gulp.task('run-jasmine-tests', ['run-nunit-tests'], function (cb) {
    var gulp_grunt = require('gulp-grunt');
    gulp_grunt.tasks()['grunt-default'](cb);
});

gulp.task('deploy', ['run-jasmine-tests', 'styles'], function (callback) {
    del([outputDirectory + '\\*debug.config',
        outputDirectory + '\\*release.config',
        outputDirectory + '\\packages.config',
        outputDirectory + '\\bin\\*.config',
        outputDirectory + '\\bin\\*.xml',
        outputDirectory + '\\**\\*.pdb',
        outputDirectory + '\\**\\*spec.js',
        outputDirectory + '\\apple-touch-icon*',
        outputDirectory + '\\Scripts\\*.map',
        outputDirectory + '\\human.txt',
        outputDirectory + '\\Content\\*.less',
        outputDirectory + '\\Scripts\\jasmine'], { force: true }, function () {
            gulp.src('.\\sources\\easygenerator.Web\\Content\\*.css').pipe(gulp.dest(outputDirectory + '\\Content'));
            gulp.src('.\\sources\\easygenerator.Web\\App\\main-built.js').pipe(gulp.dest(outputDirectory + '\\App'));
            gulp.src('.\\tools\\WebConfigTransform\\' + instance + '.config').pipe($.rename('Web.config')).pipe(gulp.dest(outputDirectory));
            del(['.\\tools\\WebConfigTransform\\' + instance + '.config'], { force: true }, callback);
        });
});

gulp.task('build', ['clean', 'deploy'], function () {});