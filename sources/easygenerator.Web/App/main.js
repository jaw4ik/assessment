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

define(['durandal/system', 'durandal/app', 'plugins/router', 'bootstrapper', 'userContext', 'synchronization/listener', 'onboarding/initialization'],
    function (system, app, router, bootstrapper, userContext, synchronization, onboarding) {
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

        var hashPart = window.location.hash.replace('#', '');
        var hashParams = router.parseQueryString(hashPart);

        var ltiAuthDefer;
        if (hashParams && hashParams['token.lti']) {
            ltiAuthDefer =
                $.ajax({ url: '/lti/authenticate', type: 'POST' }).done(function (response) {
                    if (response && response.success) {

                        window.auth.login(response.data);
                    }
                }).complete(function() {
                    
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