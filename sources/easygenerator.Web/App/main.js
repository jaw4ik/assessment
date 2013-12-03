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
    ko.validation.configure({
        insertMessages: false
    });
    return ko;
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'bootstrapper'],
    function (system, app, viewLocator, bootstrapper) {

        if (!has('release')) {
            system.debug(true);
        }

        app.title = "easygenerator";

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true
        });

        app.start().then(function () {
            viewLocator.useConvention();
            bootstrapper.run();
            app.setRoot('viewmodels/shell');
        });

    }
);