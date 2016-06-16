/* eslint-env node*/

module.exports = function (config) {
    "use strict";

    config.set({

        basePath: "./sources/easygenerator.Web",

        frameworks: ["jspm", "jasmine"],

        files: [
            'Scripts/jquery-2.1.3.js',
            'Scripts/knockout-3.3.0.js',
            'Scripts/q.js',
            'Scripts/underscore.js',
            'Scripts/underscore.extensions.js',
            'Scripts/jasmine/matchers.js',
            'Scripts/jasmine/utils.js',
            "Scripts/auth.js",
            'Scripts/polyfills.js',
            "Scripts/system-hooks.js"
        ],

        proxies: {
            "/base/app/app": "/base/App/",
            "/base/app": "/base/App/"
        },

        jspm: {
            config: 'config.js',
            serveFiles: [
                "**/*.*"
            ],
            packages: 'Scripts/vendor',
            loadFiles: [
                //"app/design/tabs/PresetTab.spec.js" //EXAMPLE
                //"app/design/*.spec.js",             //EXAMPLE
                "app/**/*.spec.js"
            ]
        },
        browserDisconnectTimeout: 600000,
        browserNoActivityTimeout: 600000,
        autoWatch: true,

        browsers: ["Chrome"],

        plugins: [
            "karma-jspm",
            "karma-chrome-launcher",
            "karma-jasmine"
        ]

    });
};
