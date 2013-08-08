require.config({
    paths: {
        "text": "durandal/amd/text"
    }
});


//>>excludeStart("build", true);
require.config({
    urlArgs: 'v=' + Math.random()
});
//>>excludeEnd("build");

ko.validation.configure({
    insertMessages: false
});

define(function (require) {
    var
        system = require('durandal/system'),
        app = require('durandal/app'),
        viewLocator = require('durandal/viewLocator')
    ;

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = "easygenerator";

    app.start().then(function () {
        // When finding a module, replace the viewmodel string 
        // with view to find it partner view.
        // [viewmodel]s/sessions --> [view]s/sessions.html
        // Otherwise you can pass paths for modules, views, partials
        // Defaults to viewmodels/views/views. 
        viewLocator.useConvention();

        app.setRoot('viewmodels/_layout', 'entrance');
    });

});