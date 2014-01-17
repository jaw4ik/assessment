requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    },
    urlArgs: !has('release') ? 'v=' + Math.random() : ''
});

define('jquery', function () {
    return jQuery;
});

define('knockout', function () {
    ko.validation.configure({
        insertMessages: false
    });
    return ko;
});

define(['durandal/system', 'durandal/app', 'bootstrapper', 'userContext'],
    function (system, app, bootstrapper, userContext) {

        if (!has('release')) {
            system.debug(true);
        }

        app.title = "easygenerator";

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true,
            widget: true
        });

        app.start().then(function () {
            bootstrapper.run();

            userContext.identify().then(function () {
                app.setRoot('viewmodels/shell');
            });
        });

    }
);