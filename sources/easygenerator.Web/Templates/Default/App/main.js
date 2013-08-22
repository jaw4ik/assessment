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

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'browserSupport', 'context', 'eventsManager', 'xAPI/requestManager'],
    function (app, viewLocator, system, getRootView, courseContext, eventsManager, xAPIRequestManager) {

        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        courseContext.initialize().then(function () {
            
            app.title = courseContext.experience.title;

            var url = window.location.toString();
            var hashIndex = url.indexOf("#");
            if (hashIndex !== -1)
                url = url.substring(0, hashIndex);
            url += '?experience_id=' + courseContext.experience.id;

            xAPIRequestManager.init(eventsManager, "Anonymous user", "anonymous@easygenerator.com", app.title, url);
        });

        app.start().then(function () {

            viewLocator.useConvention();
            app.setRoot(getRootView);
        });
    });