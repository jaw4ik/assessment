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
    ko.validation.configure({
        insertMessages: false
    });
    return ko;
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'durandal/composition'],
    function (system, app, viewLocator, composition) {

        if (!has('release')) {
            system.debug(true);
        }

        composition.addBindingHandler('hasFocus');

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

    }
);