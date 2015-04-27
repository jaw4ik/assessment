exports.config = function (weyland) {
    weyland.build('main')
        .task.jshint({
            include: 'App/**/*.js',
            exclude: ['App/main-built.js']
        })
        .task.uglifyjs({
            include: ['App/**/*.js', 'Scripts/durandal/**/*.js'],
            exclude: ['App/**/*.spec.js', 'App/main-built.js']
        })
        .task.rjs({
            include: ['App/**/*.{js,html}', 'Scripts/durandal/**/*.js'],
            exclude: ['App/**/*.spec.js', 'App/specs.html'],
            loaderPluginExtensionMaps: {
                '.html': 'text'
            },
            rjs: {
                name: '../Scripts/almond-custom', //to deploy with require.js, use the build's name here instead
                insertRequire: ['main'], //not needed for require
                baseUrl: 'App',
                wrap: true, //not needed for require
                paths: {
                    'text': '../Scripts/text',
                    'durandal': '../Scripts/durandal',
                    'plugins': '../Scripts/durandal/plugins',
                    'transitions': '../Scripts/durandal/transitions',
                    'knockout': 'empty:',
                    'jquery': 'empty:'
                },
                inlineText: true,
                optimize: 'uglify2',
                stubModules: ['text', 'knockout', 'jquery'],
                keepBuildDir: true,
                out: 'App/main-built.js',
                has: {
                    release: true
                }
            }
        });
}