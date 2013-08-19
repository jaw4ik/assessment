define(['durandal/app', 'plugins/router', 'configuration/routes', 'dataContext', 'localization/localizationManager'],
    function (app, router, routes, datacontext, localizationManager) {
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

                        router.updateDocumentTitle = function (instance, instruction) {
                            var title = null;

                            if (instruction.config.settings && instruction.config.settings.localizationKey) {
                                title = localizationManager.localize(instruction.config.settings.localizationKey);

                            } else if (instruction.config.title) {
                                title = instruction.config.title;
                            }

                            document.title = title ? app.title + ' | ' + title : app.title;
                        };

                        return router.map(routes)
                            .buildNavigationModel()
                            .activate('objectives');

                    });
            };

        return {
            activate: activate,
            cssName: cssName,
            router: router
        };
    }
);