requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

//>>excludeStart("build", true);
require.config({
    urlArgs: 'v=' + Math.random()
});
//>>excludeEnd("build");

ko.validation.configure({
    insertMessages: false
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'],
    function (system, app, viewLocator) {
        //>>excludeStart("build", true);
        system.debug(true);
        //>>excludeEnd("build");

        app.title = "easygenerator";

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true
        });

        app.start().then(function () {
            // When finding a module, replace the viewmodel string 
            // with view to find it partner view.
            // [viewmodel]s/sessions --> [view]s/sessions.html
            // Otherwise you can pass paths for modules, views, partials
            // Defaults to viewmodels/views/views. 
            viewLocator.useConvention();

            app.setRoot('viewmodels/shell');
        });

    });