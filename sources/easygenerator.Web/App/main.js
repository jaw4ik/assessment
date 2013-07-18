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
    errorMessageClass: 'help-inline'
});

define(function (require) {
    var
        system = require('durandal/system'),
        app = require('durandal/app'),
        router = require('durandal/plugins/router'),
        viewLocator = require('durandal/viewLocator'),
        localizationManager = require('localization/localizationManager')
    ;

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");
    
    app.title = "easygenerator";
    
    app.start().then(function () {

        // route will use conventions for modules
        // assuming viewmodels/views folder structure
        router.useConvention();

        // When finding a module, replace the viewmodel string 
        // with view to find it partner view.
        // [viewmodel]s/sessions --> [view]s/sessions.html
        // Otherwise you can pass paths for modules, views, partials
        // Defaults to viewmodels/views/views. 
        viewLocator.useConvention();

        localizationManager.initialize(window.top.userCultures);

        app.setRoot('viewmodels/_layout', 'entrance');
        // override bad route behavior to write to 
        // console log and show error toast
        router.handleInvalidRoute = function (route, params) {
            system.log(route ? '[' + route + '] ' : '', 'No route found');
        };
        
        // Apply localization to route caption
        var onNavigationCompleteBase = router.onNavigationComplete;
        router.onNavigationComplete = function (routeInfo, params, module) {
            if (!_.isEmpty(routeInfo.settings.localizationKey)) {
                routeInfo.caption = localizationManager.localize(routeInfo.settings.localizationKey);
            }

            onNavigationCompleteBase(routeInfo, params, module);
        };
    });

});