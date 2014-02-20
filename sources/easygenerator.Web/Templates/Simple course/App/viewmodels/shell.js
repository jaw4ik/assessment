define(['durandal/app', 'plugins/router', 'configuration/routes', 'context', 'modulesInitializer', 'modules/graphicalCustomization'],
    function (app, router, routes, context, modulesInitializer, graphicalCustomisation) {

        return {
            router: router,
            cssName: ko.computed(function() {
                var activeItem = router.activeItem();
                if (_.isObject(activeItem)) {
                    var moduleId = activeItem.__moduleId__;
                    moduleId = moduleId.slice(moduleId.lastIndexOf('/') + 1);
                    return moduleId;
                }
                return '';
            }),

            viewSettings: function () {
                var settings = {
                    rootLinkEnabled: true,
                    navigationEnabled: true
                };
                
                var activeInstruction = router.activeInstruction();
                if (_.isObject(activeInstruction)) {
                    settings.rootLinkEnabled = !activeInstruction.config.rootLinkDisabled;
                    settings.navigationEnabled = !activeInstruction.config.hideNav;
                }
                return settings;
            },
            
            logoUrl: '',

            activate: function () {
                var that = this;
                return context.initialize().then(function (dataContext) {
                    app.title = dataContext.course.title;

                    return modulesInitializer.init().then(function () {
                        that.logoUrl = graphicalCustomisation.settings.logoUrl;

                        return router.map(routes)
                            .buildNavigationModel()
                            .mapUnknownRoutes('viewmodels/404', '404')
                            .activate('');
                    });
                });
            }
        };

    });