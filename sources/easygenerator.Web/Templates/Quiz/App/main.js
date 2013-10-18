requirejs.config({
    paths: {
        'text': 'durandal/amd/text'        
    },
    urlArgs: 'v=' + Math.random()
});

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'browserSupport'],
    function (app, viewLocator, system, getRootView) {

        app.title = 'easygenerator';

        app.start().then(function () {

            viewLocator.useConvention();
            app.setRoot(getRootView);
        });
    });