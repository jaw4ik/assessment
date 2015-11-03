define(['durandal/system', 'durandal/app', 'bootstrapper', 'userContext', 'synchronization/listener', 'onboarding/initialization', 'audio/index', 'localization/localizationManager'],
    function (system, app, bootstrapper, userContext, synchronization, onboarding, audio, localizationManager) {
        if (!has('release')) {
            system.debug(true);
        }

        app.title = "easygenerator";

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true,
            widget: {
                kinds: ['preloader']
            }
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
                localizationManager.initialize(window.userCultures).then(function () {
                    $('html').attr('lang', localizationManager.language);

                    bootstrapper.run();
                    
                    return Q.all([
                        userContext.identify(),
                        userContext.identifyStoragePermissions(),
                        synchronization.start(),
                        onboarding.initialize(),
                        audio.initialize()
                    ]).spread(function () {
                        app.setRoot('viewmodels/shell', null, document.getElementById('app'));
                    });
                });
            }).done();
        });
    }
);