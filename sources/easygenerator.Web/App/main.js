﻿requirejs.config({
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

        var ltiAuthDefer;
        if (window.lti.isForceLogoutKeyPresent()) {
            window.auth.logout();
            window.location.replace('/#');
        }

        if (window.lti.isAuthTokenPresent()) {
            window.auth.logout();
            ltiAuthDefer = window.lti.authenticate().complete(function () {
                window.location.replace('/#');
            });
        } else {
            ltiAuthDefer = Q.fcall(function () { });
        }

        ltiAuthDefer.then(function () {
            app.start().then(function () {
                bootstrapper.run();

                return Q.all([userContext.identify(), userContext.identifyStoragePermissions(), synchronization.start(), onboarding.initialize()])
                    .spread(function () {
                        app.setRoot('viewmodels/shell', null, document.getElementById('app'));
                    });

            }).done();
        });
    }
);