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

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'modulesInitializer', 'browserSupport', 'settingsReader', 'bootstrapper'],
    function (app, viewLocator, system, modulesInitializer, browserSupport, settingsReader, bootstrapper) {
        app.title = 'easygenerator';

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true
        });


        app.start().then(function () {
            bootstrapper.run();
          
            if (!browserSupport.isSupportedMobile && !browserSupport.isSupportedBrowser) {
                app.setRoot(browserSupport.isMobileDevice ? 'viewmodels/notsupportedbrowserMobile' : 'viewmodels/notsupportedbrowser');
                return;
            }
            var modules = [],
                promises = [];

            promises.push(readTemplateSettings());

            promises.push(readPublishSettings());

            Q.allSettled(promises).then(function () {
                modulesInitializer.register(modules);
                app.setRoot('viewmodels/shell');
            });

            function readTemplateSettings() {
                return settingsReader.readTemplateSettings().then(function (settings) {
                    modules['modules/templateSettings'] = settings;
                    modules['xApi/xApiInitializer'] = settings.xApi;
                });
            }

            function readPublishSettings() {
                return settingsReader.readPublishSettings().then(function(settings) {
                    _.each(settings.modules, function(module) {
                        modules[module.name] = true;
                    });
                });
            }

        });
    }
);