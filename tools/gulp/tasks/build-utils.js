import eventStream from 'event-stream';
import MSTest from 'mstest';
import Q from 'q';
import gulp from 'gulp';
import fs from 'fs';
import gulpLoadPugin from 'gulp-load-plugins';

var $ = gulpLoadPugin({
    lazy: true
});

export default function () {
    var buildVersion = +new Date();

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
    }

    function runUnitTests(testsPaths) {
        var defer = Q.defer();
        runTest(testsPaths, defer, []);
        return defer.promise;
    }

    function runTest(testsPath, defer, failedResult) {
        var msTest = new MSTest();
        var instance = testsPath.shift();
        if (typeof instance !== 'undefined') {
            msTest.testContainer = instance;
        } else {
            if (failedResult.length) {
                console.log('\n______');
                console.log('FAILED:');
                var i = 0;
                for (; i < failedResult.length; i++) {
                    console.log(failedResult[i]);
                }
                console.log('______\n');
                defer.reject(failedResult.length + ' tests have failed');
            } else {
                defer.resolve();
            }

            return;
        }
        msTest.details.errorMessage = true;
        msTest.details.errorStackTrace = true;
        msTest.runTests({
            eachTest: function (test) {
                console.log(test.status + ' - ' + test.name);
            },
            done: function (results, passed, failed) {
                console.log(passed.length + '/' + results.length);
                if (failed.length) {
                    var i = 0;
                    for (; i < failed.length; i++) {
                        failedResult.push(failed[i].name + ' - ' + failed[i].errorMessage);
                    }
                }
                runTest(testsPath, defer, failedResult);
            }
        });
    }

    function transformWebConfig(projPath, outputPath, instance) {
        return gulp.src(projPath)
            .pipe($.msbuild({
                stdout: true,
                targets: ['Transform'],
                errorOnFail: true,
                maxBuffer: 16 * 1024 * 1000,
                toolsVersion: 14.0,
                properties: {
                    Instance: instance,
                    Configuration: 'Release',
                    OutputPath: outputPath
                }
            }));
    }

    function buildProjects(projectPaths, outDir, webProjectOutputDir) {
        var props = {
            TreatWarningsAsErrors: true,
            Configuration: 'Release',
            DebugSymbols: false,
            DebugType: 'none'
        };

        if (outDir) {
            props.OutDir = outDir;
        }

        if (webProjectOutputDir) {
            props.WebProjectOutputDir = webProjectOutputDir;
        }

        return gulp.src(projectPaths)
            .pipe($.msbuild({
                stdout: true,
                errorOnFail: true,
                maxBuffer: 16 * 1024 * 1000,
                toolsVersion: 14.0,
                targets: ['Clean', 'Build'],
                properties: props
            }));
    }

    function createDirectory(cb, path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        cb();
    }

    function moveWebConfig(path, outputDirectory) {
        return gulp.src(path)
             .pipe($.rename('Web.config'))
             .pipe(gulp.dest(outputDirectory));
    }

    return {
        addBuildVersion: addBuildVersion,
        runUnitTests: runUnitTests,
        transformWebConfig: transformWebConfig,
        buildProjects: buildProjects,
        createDirectory: createDirectory,
        moveWebConfig: moveWebConfig
    }
};