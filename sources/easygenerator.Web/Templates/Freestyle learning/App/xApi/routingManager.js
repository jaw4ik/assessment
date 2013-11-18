define(['plugins/router', './configuration/routes'],
    function (router, routes) {

        "use strict";

        var
            existingGuard = null,
            navigationModel = null,

            mapRoutes = function (moduleInitializer) {
                createGuard(moduleInitializer);
                router.map(routes);
            },

            removeRoutes = function() {
                removeGuard();
                showNavigation();
            },

            createGuard = function (moduleInitializer) {
                existingGuard = router.guardRoute;
                router.guardRoute = function (model, route) {
                    changeNavigationVisibility(route);

                    if (route.config.route == 'login') {
                        return moduleInitializer.getInitStatus() ? 'home' : true;
                    }
                    if (!moduleInitializer.getInitStatus()) {
                        return 'login';
                    }
                    if (_.isFunction(existingGuard)) {
                        return existingGuard(model, route);
                    }
                    return true;
                };
            },
            
            removeGuard = function () {
                router.guardRoute = existingGuard;
            },

            changeNavigationVisibility = function (route) {
                if (route.config.hideNav) {
                    hideNavigation();
                } else {
                    showNavigation();
                }
            },

            hideNavigation = function () {
                if (router.navigationModel && router.navigationModel().length > 0) {
                    navigationModel = router.navigationModel();
                }
                router.navigationModel([]);
            },

            showNavigation = function () {
                if (navigationModel && navigationModel.length > 0) {
                    router.navigationModel(navigationModel);
                }
            };

        return {
            mapRoutes: mapRoutes,
            removeRoutes: removeRoutes
        };

    }
);