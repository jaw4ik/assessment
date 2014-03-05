define(['durandal/app', 'durandal/composition', 'plugins/router', 'configuration/routes', 'context', 'modulesInitializer', 'modules/graphicalCustomization'],
    function (app, composition, router, routes, context, modulesInitializer, graphicalCustomisation) {

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
            
            logoUrl: ko.observable(''),
            isNavigatingToAnotherView: ko.observable(false),


            activate: function () {
                var that = this;
                
                router.on('router:route:activating').then(function (newView) {
                    var currentView = router.activeItem();
                    if (newView && currentView && newView.__moduleId__ === currentView.__moduleId__) {
                        return;
                    }
                    that.isNavigatingToAnotherView(true);

                    composition.current.complete(function () {
                        that.isNavigatingToAnotherView(false);
                    });
                });
                
                return context.initialize().then(function (dataContext) {
                    app.title = dataContext.course.title;

                    return modulesInitializer.init().then(function () {
                        
                        that.logoUrl(graphicalCustomisation.settings.logoUrl);

                        return router.map(routes)
                            .buildNavigationModel()
                            .mapUnknownRoutes('viewmodels/404', '404')
                            .activate('');
                    });
                });
            }
        };

    });