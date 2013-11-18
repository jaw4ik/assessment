define(['durandal/app', 'plugins/router', 'configuration/routes', 'context', 'modulesInitializer'],
    function (app, router, routes, context, modulesInitializer) {

        return {
            router: router,
            cssName: ko.computed(function () {
                var activeItem = router.activeItem();
                if (_.isObject(activeItem)) {
                    var moduleId = activeItem.__moduleId__;
                    moduleId = moduleId.slice(moduleId.lastIndexOf('/') + 1);
                    return moduleId;
                }
                return '';
            }),

            activate: function () {
                return context.initialize().then(function () {
                    return modulesInitializer.init().then(function () {
                        return router.map(routes)
                            .buildNavigationModel()
                            .mapUnknownRoutes('viewmodels/404', '404')
                            .activate('');
                    });
                });
            }
        };

    });