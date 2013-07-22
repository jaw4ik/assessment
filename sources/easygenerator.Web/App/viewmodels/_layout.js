define(['durandal/plugins/router', 'configuration/routes', 'dataContext', 'localization/localizationManager'],
    function (router, routes, datacontext, localizationManager) {
        var
            startModule = 'objectives',
            activate = function () {
                return datacontext.initialize()
                    .then(function () {

                        localizationManager.initialize(window.top.userCultures);

                        router.useConvention();

                        router.map(routes);

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
            router: router
        };
    }
);