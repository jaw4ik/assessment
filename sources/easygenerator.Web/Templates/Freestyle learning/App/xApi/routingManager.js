define(['plugins/router', './configuration/routes'],
    function (router, routes) {

        "use strict";

        var
            existingGuard = null,
            navigationModel = null,

            mapRoutes = function (activityManager) {
                createGuard(activityManager);
                router.map(routes);
            },

            removeRoutes = function() {
                removeGuard();
                showNavigation();
            },

            createGuard = function (activityManager) {
                existingGuard = router.guardRoute;
                router.guardRoute = function (model, route) {
                    changeNavigationVisibility(route);

                    if (route.config.route == 'login') {
                        return activityManager.getInitStatus() ? 'home' : true;
                    }
                    if (!activityManager.getInitStatus()) {
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