requirejs.config({
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

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'modulesInitializer', 'browserSupport', 'settingsReader'],
    function (app, viewLocator, system, modulesInitializer, getRootView, settingsReader) {

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true
        });

        app.start().then(function () {
            viewLocator.useConvention();
            app.setRoot(getRootView);

            app.title = 'easygenerator';

            var modules = [];

            Q.allSettled([

            settingsReader.readTemplateSettings().then(function (settings) {
                modules['modules/graphicalCustomization'] = settings.logo;
                modules["xApi/xApiInitializer"] = settings.xApi;
            }),

            settingsReader.readPublishSettings().then(function (settings) {
                _.each(settings.modules, function(module) {
                    modules[module.name] = true;
                });

            })]).then(function () {
                modulesInitializer.register(modules);
            });
        });
    }
);