define(['durandal/system', 'durandal/app', 'bootstrapper', 'userContext', 'synchronization/listener', 'onboarding/initialization', 'audio/index',
'plugins/router',
'plugins/dialog',
'plugins/http',
'plugins/widget'],
    function (system, app, bootstrapper, userContext, synchronization, onboarding, audio) {
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
            console.log('pre app.start');
            
            app.start().then(function () {
                console.log('pre bootstrapper.run');
                bootstrapper.run();
                console.log('after bootstrapper.run');

                return Q.all([
                    userContext.identify(),
                    userContext.identifyStoragePermissions(),
                    synchronization.start(),
                    onboarding.initialize(),
                    audio.initialize()
                ]).spread(function () {
                    console.log('app.setRoot called');
                    debugger;
                    app.setRoot('viewmodels/shell', null, document.getElementById('app'));
                });

            }).done();
        });
    }
);