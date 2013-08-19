define(['plugins/router', 'configuration/routes', 'dataContext', 'localization/localizationManager'],
    function (router, routes, datacontext, localizationManager) {
        var
            startModule = 'objectives',
            cssName = ko.computed(function () {
                var activeItem = router.activeItem();
                if (_.isObject(activeItem)) {
                    var moduleId = activeItem.__moduleId__;
                    moduleId = moduleId.slice(moduleId.lastIndexOf('/') + 1);
                    return moduleId;
                }
                return '';
            }),
            activate = function () {
                return datacontext.initialize()
                    .then(function () {

                        localizationManager.initialize(window.top.userCultures);

                        return router.map(routes)
                            .buildNavigationModel()                            
                            .activate('objectives');




                        router.useConvention();

                        router.map();

                        router.handleInvalidRoute = function (route) {
                            router.replaceLocation("#/404");
                        };

                        var onNavigationCompleteBase = router.onNavigationComplete;
                        router.onNavigationComplete = function (routeInfo, params, module) {
                            if (!_.isEmpty(routeInfo.settings.localizationKey)) {
                                routeInfo.caption = localizationManager.localize(routeInfo.settings.localizationKey);
                            }

                            onNavigationCompleteBase(routeInfo, params, module);
                        };

                        return router.activate(startModule);
                    });
            };

        return {
            activate: activate,
            cssName: cssName,
            router: router
        };
    }
);