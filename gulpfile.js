/// <binding ProjectOpened='watch' />
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var gulp = require('gulp'),
	eventStream = require('event-stream'),
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
		srcPlayer: ['./sources/easygenerator.Player/public/styles/*.less'],
		destPlayer: './sources/easygenerator.Player/public/styles',
        dest: './sources/easygenerator.Web/Content',
        browsers: ['last 1 Chrome version', 'last 1 Firefox version', 'last 1 Explorer version', 'last 1 Safari version']
    }
},
    outputDirectory = args.output || 'D:/Applications/easygenerator',
    outputConvertionServer = args.outputConvertion || 'D:/Applications/convertion',
	outputPlayer = args.outputPlayer || 'D:/Applications/player',
    instance = args.instance || 'Release',
    version = typeof args.version === 'string' && args.version !== '' ? args.version : '1.0.0',
    createTags = Boolean(args.createTags),
	buildVersion = +new Date();
	
function addBuildVersion() {
    return eventStream.map(function (file, callback) {
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
            toolsVersion: 14.0,
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
            toolsVersion: 14.0,
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
            toolsVersion: 14.0,
            properties: {
                PreBuildEvent: '',
                PostBuildEvent: '',
                TreatWarningsAsErrors: true
            }
        }));
});

gulp.task('build', function (cb) {
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

gulp.task('run-unit-tests', function (cb) {
    runSequence('run-server-tests', 'run-jasmine-tests', cb);
});

/*#endregion*/

/*#region deploy*/

gulp.task('deploy', function (cb) {
    runSequence('build', 'deploy-download-folder', 'deploy-css', 'deploy-main-built-js', 'deploy-web-config', 'remove-extra-files', 'add-version', 'run-unit-tests', function () {
        if (createTags) {
            runSequence('create-tags', cb);
        } else {
            cb();
        }
    });
});

gulp.task('deploy-download-folder', function (cb) {
    var folderToCreate = outputDirectory + '/Download';
    if (!fs.existsSync(folderToCreate)) {
        fs.mkdirSync(folderToCreate);
    }
    cb();
});

gulp.task('deploy-css', function () {
    return gulp.src('./sources/easygenerator.Web/Content/*.css')
        .pipe(gulp.dest(outputDirectory + '/Content'));
});

gulp.task('deploy-main-built-js', function () {
    return gulp.src('./sources/easygenerator.Web/App/main-built.js')
        .pipe(gulp.dest(outputDirectory + '/App'));
});

gulp.task('deploy-web-config', function () {
    return gulp.src('./tools/WebConfigTransform/' + instance + '.config')
        .pipe($.rename('Web.config'))
        .pipe(gulp.dest(outputDirectory));
});

gulp.task('remove-extra-files', function (cb) {
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

gulp.task('add-version', function (cb) {
    xmlpoke(outputDirectory + '/Web.config', function (webConfig) {
        webConfig.withBasePath('configuration')
            .setOrAdd("appSettings/add[@key='version']/@value", version);
    });
    cb();
});

gulp.task('create-tags', function () {
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

    function createTag(repoName, defer) {
        github.releases.createRelease({
            owner: reposOwner,
            repo: repoName,
            tag_name: version,
            name: 'Release v' + version
        }, function (err, result) {
            if (err === null) {
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

/*#region deploy convertion server*/

gulp.task('clean-convertion-server', function(callback){
    del([outputConvertionServer], { force: true }, callback);
});

gulp.task('run-ut-convertion-server', ['install-npm-modules-convertion-server'], function(){
    return gulp.src('./sources/easygenerator.ConvertionServer/test/*.spec.js')
        .pipe($.mocha({reporter: 'nyan'}));
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

gulp.task('install-npm-modules-convertion-server', function(){
    return gulp.src(['./sources/easygenerator.ConvertionServer/package.json'])
        .pipe($.install());
});

gulp.task('deploy-convertion-server', ['clean-convertion-server', 'copy-convertion-server'], function () {
    return gulp.src([outputConvertionServer + '/package.json'])
        .pipe($.install());
});

/*#endregion deploy convertion server*/

/*#region deploy player*/

gulp.task('clean-player', function(callback){
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
            browsers: config.less.browsers,
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

gulp.task('assets-player', ['styles-player', 'copy-player-config-transform'], function () {
    gulp.src(['./sources/easygenerator.Player/public/styles/video.css', './sources/easygenerator.Player/public/styles/audio.css'])
		.pipe($.minifyCss())
        .pipe(gulp.dest(outputPlayer + '/public/styles/'));
	gulp.src('./sources/easygenerator.Player/public/vendor/video.js/dist/font/*.*')
		.pipe(gulp.dest(outputPlayer + '/public/styles/font'));
	return gulp.src('./sources/easygenerator.Player/public/vendor/video.js/dist/lang/*.*')
		.pipe(gulp.dest(outputPlayer + '/public/js/lang/'));
});

gulp.task('copy-player-config-transform', ['copy-player'], function(){
    return gulp.src('./tools/PlayerConfigTransform/' + instance + '.transform.js')
            .pipe($.rename('config.js'))
            .pipe(gulp.dest(outputPlayer))
})

gulp.task('deploy-player', ['assets-player'], function () {
 
  gulp.src('./sources/easygenerator.Player/views/*.jade')
    .pipe($.jadeUsemin({
      css: [$.minifyCss(), 'concat'],
      js: [$.uglify()]
    }))
	.pipe(addBuildVersion())
    .pipe(gulp.dest(outputPlayer + '/views/'));
    return gulp.src([outputPlayer + '/package.json'])
        .pipe($.install({ production: true }));
});

/*#endregion deploy player*/
