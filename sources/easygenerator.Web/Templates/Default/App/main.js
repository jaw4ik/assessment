requirejs.config({
    paths: {
        'text': 'durandal/amd/text'
    },
    urlArgs: 'v=' + Math.random()
});

ko.bindingHandlers.context = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        viewModel.__context__ = element.getContext('2d');
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var callback = ko.utils.unwrapObservable(allBindingsAccessor().contextCallback);
        callback.call(viewModel, viewModel.__context__);
    }
};

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'browserSupport', 'eventTracker', 'xAPI/requestManager'],
    function (app, viewLocator, system, getRootView, eventTracker, xAPIRequestManager) {

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = 'easygenerator';
        
        xAPIRequestManager.init(eventTracker, "Anonymous user", "anonymous@easygenerator.com", app.title, window.location.toString());

        app.start().then(function () {

            viewLocator.useConvention();
            app.setRoot(getRootView);
        });
    });