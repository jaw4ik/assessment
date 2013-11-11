define(['durandal/app', 'plugins/router', 'configuration/routes', 'context', 'eventManager', 'xApi/activityProvider'],
    function (app, router, routes, context, eventManager, activityProvider) {

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

            return context.initialize()
                .then(function (data) {

                    window.location.hash = '';

                    var title = data.experience.title;
                    var url = window.location.toString() + '?experience_id=' + data.experience.id;;

                    var actor = activityProvider.createActor("Anonymous user", "anonymous@easygenerator.com");
                    return activityProvider.init(actor, title, url).then(function () {
                        return router.map(routes)
                            .buildNavigationModel()
                            .mapUnknownRoutes('viewmodels/404', '404')
                            .activate('')
                            .then(function () {
                                app.trigger(eventManager.events.courseStarted);
                            });
                    });
                });
        }
    };

});