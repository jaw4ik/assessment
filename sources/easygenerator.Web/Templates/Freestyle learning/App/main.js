﻿requirejs.config({
    paths: {
        'text': '../js/text',
        'durandal': '../js/durandal',
        'plugins': '../js/durandal/plugins',
        'transitions': '../js/durandal/transitions'
    },
    urlArgs: 'v=' + Math.random()
});

define('jquery', function () { return jQuery; });
define('knockout', function () { return ko; });

ko.bindingHandlers.context = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        viewModel.__context__ = element.getContext('2d');
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var callback = ko.utils.unwrapObservable(allBindingsAccessor().contextCallback);
        callback.call(viewModel, viewModel.__context__);
    }
};

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'browserSupport'],
    function (app, viewLocator, system, getRootView) {

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true
        });

        app.start().then(function () {
            viewLocator.useConvention();
            app.setRoot(getRootView);
        });
    }
);