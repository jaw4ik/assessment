﻿define(['durandal/app', 'plugins/router', 'context', 'eventManager', 'configuration/routes', 'modulesInitializer'],
    function (app, router, context, eventManager, routes, modulesInitializer) {
        
        var
            cssName = ko.computed(function () {
                var activeItem = router.activeItem();
                if (_.isObject(activeItem)) {
                    var moduleId = activeItem.__moduleId__;
                    moduleId = moduleId.slice(moduleId.lastIndexOf('/') + 1);
                    return moduleId;
                }
                return '';
            }),

            isRootLinkActive = function () {
                var activeInstruction = router.activeInstruction();
                if (_.isObject(activeInstruction)) {
                    return !activeInstruction.config.rootLinkDisabled;
                }
                return true;
            },

            activate = function () {
                return context.initialize().then(function () {

                    router.replace = function (url) {
                        router.navigate(url, { replace: true, trigger: true });
                    };

                    return modulesInitializer.init().then(function () {
                        return router.map(routes)
                            .buildNavigationModel()
                            .mapUnknownRoutes('viewmodels/404', '404')
                            .activate('home');
                    });
                });
            };

        return {
            router: router,
            cssName: cssName,
            isRootLinkActive: isRootLinkActive,
            activate: activate
        };
    }
);