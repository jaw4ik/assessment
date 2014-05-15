exports.config = function (weyland) {
    weyland.build('main')
        //.task.jshint({
        //    include: 'App/**/*.js',
        //    exclude: ['App/main-built.js']
        //})
        .task.rjs({
            include: ['App/**/*.{js,html}', 'js/durandal/**/*.js'],
            exclude: ['App/**/*.spec.js'],
            loaderPluginExtensionMaps: {
                '.html': 'text'
            },
            rjs: {
                name: 'main',
                insertRequire: ['main'],
                mainConfigFile: 'App/main.js',
                baseUrl: 'App',
                paths: {
                    'text': '../js/text',
                    'durandal': '../js/durandal',
                    'plugins': '../js/durandal/plugins',
                    'transitions': '../js/durandal/transitions',
                    'knockout': 'empty:',
                    'jquery': 'empty:'
                },
                inlineText: true,
                optimize: 'uglify2',
                stubModules: ['text', 'knockout', 'jquery'],
                pragmas: {
                    build: true
                },
                out: 'App/main-built.js'
            }
        });
}
