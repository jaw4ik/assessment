define(['durandal/app', 'plugins/router', 'configuration/routes', 'dataContext', 'localization/localizationManager'],
    function (app, router, routes, datacontext, localizationManager) {
        var
            startModule = 'experiences',
            activeModule = ko.computed(function () {
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

                        router.replace = function (url) {
                            router.navigate(url, { replace: true, trigger: true });
                        };

                        router.download = function (url) {
                            var downloadUrl = window.location.href.replace(window.location.hash, url);
                            window.location.assign(downloadUrl);
                        };

                        return router.map(routes)
                            .buildNavigationModel()
                            .activate(startModule);

                    });
            };

        return {
            activate: activate,
            activeModuleName: activeModule,
            router: router,
            homeModuleName: startModule
        };
    }
);