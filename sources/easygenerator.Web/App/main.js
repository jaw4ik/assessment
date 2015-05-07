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
    return ko;
});

define(['durandal/system', 'durandal/app', 'bootstrapper', 'userContext', 'synchronization/listener', 'onboarding/initialization'],
    function (system, app, bootstrapper, userContext, synchronization, onboarding) {
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

            return Q.all([userContext.identify(), synchronization.start(), onboarding.initialize()])
                .spread(function () {
                    app.setRoot('viewmodels/shell', null, document.getElementById('app'));
                });

        }).done();

    }
);