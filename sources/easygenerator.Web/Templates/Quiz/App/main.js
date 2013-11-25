requirejs.config({
    paths: {
        'text': '../js/text',
        'durandal': '../js/durandal',
        'plugins': '../js/durandal/plugins',
        'transitions': '../js/durandal/transitions'
    },
    urlArgs: 'v=' + Math.random()
});

define('jquery', function () {
    return jQuery;
});

define('knockout', function () {
    return ko;
});

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'modulesInitializer', 'browserSupport', 'settingsReader'],
    function (app, viewLocator, system, modulesInitializer, getRootView, settingsReader) {
        
        app.title = 'easygenerator';

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true
        });

        app.start().then(function () {
            viewLocator.useConvention();
            app.setRoot(getRootView);

            settingsReader.read().then(function (settings) {
                modulesInitializer.register({
                    "xApi/xApiInitializer": settings.xApi
                });
            });

        });
    }
);