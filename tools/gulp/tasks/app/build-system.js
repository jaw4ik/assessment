import gulp from 'gulp';
import config from '../../config';
import Q from 'q';
import fs from 'fs';
import jspm from 'jspm';

var SystemJSBuilder = jspm.Builder;

gulp.task('build-system', function (cb) {
    buildInSequence([buildScripts, buildViews]);

    function buildInSequence(buildFunctions) {
        var fullSource = '',
            promise = Q();

        buildFunctions.forEach(function (currentFunction) {
            promise = promise.then(function () {
                return currentFunction().then(function (bundle) {
                    fullSource += bundle.source;
                });
            });
        });

        promise.then(function () {
            fs.writeFile(config.app.outputMainBuiltFilePath, fullSource, null, cb);
        }).catch(function (err) {
            console.log('SystemJS build error');
            console.log(err);
        });
    }

    function buildScripts() {
        return createBundle('[**/*.js] - [**/*.spec] - [main-built]', {
            paths: {
                '*': 'app/*'
            }
        });
    }

    function buildViews() {
        return createBundle('[**/*.html]', {
            defaultJSExtensions: false,
            map: {
                'text': 'github:systemjs/plugin-text@0.0.3/text.js'
            },
            meta: {
                '*.html': {
                    loader: 'text'
                }
            }
        });
    }

    function createBundle(expression, bundleConfig) {
        return new SystemJSBuilder(config.app.baseAppPath, config.app.systemConfigFilePath)
            .bundle(expression, {
                config: bundleConfig
            });
    }
});