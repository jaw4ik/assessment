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

define(['durandal/system', 'durandal/app', 'bootstrapper', 'userContext', 'synchronization/listener', 'onboarding/initialization', 'localization/localizationManager'],
    function (system, app, bootstrapper, userContext, synchronization, onboarding, localizationManager) {
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

        var ltiAuthDefer;

        if (window.auth.isLogoutKeyPresentInHash()) {
            window.auth.logout();
            window.location.replace('/#');
        }

        if (window.auth.isAuthTokenPresentInHash()) {
            window.auth.logout();
            ltiAuthDefer = window.auth.loginByAuthToken().then(function () {
                window.location.replace('/#');
            });
        } else {
            ltiAuthDefer = Q.fcall(function () { });
        }

        ltiAuthDefer.then(function () {
            app.start().then(function () {
                bootstrapper.run();

                return Q.all([localizationManager.initialize(), userContext.identify(), userContext.identifyStoragePermissions(), synchronization.start(), onboarding.initialize()])
                    .spread(function () {
                        app.setRoot('viewmodels/shell', null, document.getElementById('app'));
                    });

            }).done();
        });
    }
);