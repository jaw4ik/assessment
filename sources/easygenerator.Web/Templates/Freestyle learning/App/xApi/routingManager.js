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
            },

            createGuard = function (moduleInitializer) {
                existingGuard = router.guardRoute;
                router.guardRoute = function (model, route) {
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
            };

        return {
            mapRoutes: mapRoutes,
            removeRoutes: removeRoutes
        };

    }
);