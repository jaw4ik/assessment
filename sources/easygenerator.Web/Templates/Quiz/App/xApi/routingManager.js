define(['plugins/router', './configuration/routes'],
    function (router, routes) {

        "use strict";

        var
            existingGuard = null,

            mapRoutes = function (activityManager) {
                createGuard(activityManager);
                router.map(routes);
            },

            removeRoutes = function() {
                removeGuard();
            },

            createGuard = function (activityManager) {
                existingGuard = router.guardRoute;
                router.guardRoute = function (model, route) {
                    if (route.config.route == 'login') {
                        return activityManager.getInitStatus() ? '' : true;
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
            };

        return {
            mapRoutes: mapRoutes,
            removeRoutes: removeRoutes
        };

    }
);