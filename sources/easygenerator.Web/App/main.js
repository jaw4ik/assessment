
//requirejs.config({
//    paths: {
//        'text': '../Scripts/text',
//        'durandal': '../Scripts/durandal',
//        'plugins': '../Scripts/durandal/plugins',
//        'transitions': '../Scripts/durandal/transitions'
//    },
//    urlArgs: !has('release') ? 'v=' + Math.random() : ''
//});

window.define = System.amdDefine;
window.require = window.requirejs = System.amdRequire;

System.config({
    baseURL: '/app',
    transpiler: 'babel',
    map: {
        babel: '/Scripts/babel-core/browser.js',
        durandal: '/Scripts/durandal',
        plugins: '/Scripts/durandal/plugins'
        //transitions: '/Scripts/durandal/transitions',
        //text: '/Scripts/systemjs/plugins/text'
    },
    defaultJSExtensions: true,
    //meta: {
    //    '*.html': {
    //        loader: 'text'
    //    }
    //},
    urlArgs: !has('release') ? 'v=' + Math.random() : ''
});

define('jquery', function () {
    return jQuery;
});

define('knockout', function () {
    return ko;
});

define(['durandal/system', 'durandal/app'],
    function (system, app, bootstrapper, userContext, synchronization, onboarding, audio) {
        //if (!has('release')) {
        //    system.debug(true);
        //}
        //app.title = "easygenerator";

        //app.configurePlugins({
        //    router: true,
        //    dialog: true,
        //    http: true,
        //    widget: true
        //});

        //var ltiAuthDefer;

        //if (window.auth.isLogoutKeyPresentInHash()) {
        //    window.auth.logout();
        //    window.location.replace('/#');
        //}

        //if (window.auth.isAuthTokenPresentInHash()) {
        //    window.auth.logout();
        //    ltiAuthDefer = window.auth.loginByAuthToken().then(function () {
        //        window.location.replace('/#');
        //    });
        //} else {
        //    ltiAuthDefer = Q.fcall(function () { });
        //}

        //ltiAuthDefer.then(function () {
            app.start().then(function () {
                //bootstrapper.run();
                app.setRoot('viewmodels/shell', null, document.getElementById('app'));
                //return Q.all([])
                //    .spread(function () {
                //        //audio.initialize();
                //        app.setRoot('viewmodels/shell', null, document.getElementById('app'));
                //    });

            }).done();
        //});
    }
);