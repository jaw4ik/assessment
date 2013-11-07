define(['durandal/app', 'plugins/router', 'context', 'eventManager', 'configuration/routes', 'xApi/activityProvider'],
    function (app, router, context, eventManager, routes, activityProvider) {
        
        var
            homeModule = 'home',

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
                return context.initialize().then(function () {
                    router.map(routes).buildNavigationModel();

                    router.replace = function (url) {
                        router.navigate(url, { replace: true, trigger: true });
                    };

                    var title = context.title;
                    var url = window.location.toString() + '?experience_id=' + context.experienceId;

                    var actor = activityProvider.createActor("Anonymous user", "anonymous@easygenerator.com");
                    return activityProvider.init(actor, title, url).then(function() {
                        return router.activate('home').then(function () {
                            app.trigger(eventManager.events.courseStarted);
                        });
                    });

//                    xApiRequestManager.init("Anonymous user", "anonymous@easygenerator.com", title, url);
                });
            };

        return {
            router: router,
            cssName: cssName,
            homeModule: homeModule,
            activate: activate
        };
    }
);