/// <binding ProjectOpened='watch' />
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var gulp = require('gulp'),
    del = require('del'),
    args = require('yargs').argv,
    MSTest = require('mstest'),
    Q = require('q'),
    GitHubApi = require('github'),
    runSequence = require('run-sequence'),
    fs = require('fs'),
    xmlpoke = require('xmlpoke');

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
    outputDirectory = args.output || 'D:/Applications/easygenerator',
    instance = args.instance || 'Release',
    version = typeof args.version === 'string' && args.version !== '' ? args.version : '1.0.0',
    createTags = Boolean(args.createTags);
	
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

/*#region build*/

gulp.task('build-main-project', function () {
    return gulp.src('./sources/easygenerator.Web/easygenerator.Web.csproj')
        .pipe($.msbuild({
            stdout: true,
            errorOnFail: true,
            targets: ['Clean', 'Build'],
            maxBuffer: 16 * 1024 * 1000,
            toolsVersion: 12.0,
            properties: {
                OutDir: outputDirectory + '/bin',
                WebProjectOutputDir: outputDirectory,
                DebugSymbols: false,
                DebugType: 'none',
                TreatWarningsAsErrors: true,
                Configuration: 'Release'
            }
        }));
});

gulp.task('build-web-config', function () {
    return gulp.src('./tools/WebConfigTransform/Transform.proj')
        .pipe($.msbuild({
            stdout: true,
            targets: ['Transform'],
            errorOnFail: true,
            maxBuffer: 16 * 1024 * 1000,
            toolsVersion: 12.0,
            properties: {
                Instance: instance,
                Configuration: 'Release',
                OutputPath: './tools/WebConfigTransform'
            }
        }));
});

gulp.task('build-unit-tests', function () {
    return gulp.src([
        './sources/easygenerator.DomainModel.Tests/easygenerator.DomainModel.Tests.csproj',
        './sources/easygenerator.DataAccess.Tests/easygenerator.DataAccess.Tests.csproj',
        './sources/easygenerator.Infrastructure.Tests/easygenerator.Infrastructure.Tests.csproj',
        './sources/easygenerator.Web.Tests/easygenerator.Web.Tests.csproj'
    ])
        .pipe($.msbuild({
            stdout: true,
            errorOnFail: true,
            maxBuffer: 16 * 1024 * 1000,
            toolsVersion: 12.0,
            properties: {
                PreBuildEvent: '',
                PostBuildEvent: '',
                TreatWarningsAsErrors: true
            }
        }));
});

gulp.task('build', function(cb){
    runSequence('clean', 'build-main-project', 'build-unit-tests', 'build-web-config', 'styles', cb)
});

/*#endregion*/

/*#region run tests*/

gulp.task('run-server-tests', function (cb) {
    var testsPath = [
        './sources/easygenerator.DomainModel.Tests/bin/Debug/easygenerator.DomainModel.Tests.dll',
        './sources/easygenerator.DataAccess.Tests/bin/Debug/easygenerator.DataAccess.Tests.dll',
        './sources/easygenerator.Infrastructure.Tests/bin/easygenerator.Infrastructure.Tests.dll',
        './sources/easygenerator.Web.Tests/bin/Debug/easygenerator.Web.Tests.dll'
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

gulp.task('run-jasmine-tests', $.shell.task([
    '"tools/grunt/node_modules/.bin/grunt" jasmine --gruntfile=tools/grunt/gruntfile.js'
], {
    maxBuffer: 64 * 1024 * 1024
}));

gulp.task('run-unit-tests', function(cb){
    runSequence('run-server-tests', 'run-jasmine-tests', cb);
});

/*#endregion*/

/*#region deploy*/

gulp.task('deploy', function (cb) {
    runSequence('build', 'deploy-download-folder', 'deploy-css', 'deploy-main-built-js', 'deploy-web-config', 'remove-extra-files', 'add-version', 'run-unit-tests', function(){
        if(createTags){
            runSequence('create-tags', cb);
        }else{
            cb();
        }
    });
});

gulp.task('deploy-download-folder', function(cb){
    var folderToCreate = outputDirectory + '/Download';
    if (!fs.existsSync(folderToCreate)){
        fs.mkdirSync(folderToCreate);
    }
    cb();
});

gulp.task('deploy-css', function(){
    return gulp.src('./sources/easygenerator.Web/Content/*.css')
        .pipe(gulp.dest(outputDirectory + '/Content'));
});

gulp.task('deploy-main-built-js', function(){
    return gulp.src('./sources/easygenerator.Web/App/main-built.js')
        .pipe(gulp.dest(outputDirectory + '/App'));
});

gulp.task('deploy-web-config', function(){
    return gulp.src('./tools/WebConfigTransform/' + instance + '.config')
        .pipe($.rename('Web.config'))
        .pipe(gulp.dest(outputDirectory));
});

gulp.task('remove-extra-files', function(cb){
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
        'tools/WebConfigTransform/' + instance + '.config'], { force: true }, cb);
});

/*#endregion*/

gulp.task('add-version', function(cb){
    xmlpoke(outputDirectory +'/Web.config', function(webConfig){
        webConfig.withBasePath('configuration')
            .setOrAdd("appSettings/add[@key='version']/@value", version);
    });
    cb();
});

gulp.task('create-tags', function(){
    // token for easygenerator-ci (replace with one if you want to crete realeses from your name)
    var authToken = '4a6abc571a3ebeac204f1980e81b1474a0aa1d5f',
        reposOwner = 'easygenerator',
        reposList = [
            'easygenerator',
            'simple',
            'exam',
            'personalized-learning',
            'quiz-v2',
            'reader',
            'lango-personalized-learning',
            'quiz-marketing',
            'quiz-for-learni',
            'lango-simple',
            'simple-ie10'
        ],
        github = new GitHubApi({
            // required
            version: "3.0.0",
            // optional
            protocol: "https",
            timeout: 5000
        });

	github.authenticate({
	    type: "oauth",
	    token: authToken
	});
    
    var defer = Q.defer();

    createTag(reposList.shift(), defer);

    return defer.promise;

	function createTag(repoName, defer){
		github.releases.createRelease({
			owner: reposOwner,	
			repo: repoName,
			tag_name: version,
			name: 'Release v'+ version
		}, function(err, result){
			if(err === null){
				console.log(repoName + ' - Created');
			} else {
				console.log(repoName + ' - Failed');
			}
            
            var nextRepo = reposList.shift();
            if (typeof nextRepo !== 'undefined') {
                createTag(nextRepo, defer);
            } else {
                defer.resolve();
            }
		});
	}
});