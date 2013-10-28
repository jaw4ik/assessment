define(['durandal/app', 'plugins/router', 'context', 'xAPI/requestManager', 'events'], function (app, router, context, xApiRequestManager, events) {
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
                router.map([
                    {
                        route: ['', 'home'],
                        moduleId: 'viewmodels/home',
                        title: 'Question'
                    },
                    {
                        route: 'summary',
                        moduleId: 'viewmodels/summary',
                        title: 'Summary'
                    },
                    {
                        route: 'objective/:objectiveId/question/:questionId/learningContents',
                        moduleId: 'viewmodels/learningContents',
                        title: 'Learning contents'
                    },
                    {
                        route: '404',
                        moduleId: 'viewmodels/404',
                        title: '404 Not found'
                    },
                    {
                        route: '400',
                        moduleId: 'viewmodels/400',
                        title: '400 Bad Request'
                    },
                    {
                        route: 'xapierror/:backUrl',
                        moduleId: 'viewmodels/xAPIError',
                        title: 'xAPIError'
                    }
                ]).buildNavigationModel();

                router.replace = function (url) {
                    router.navigate(url, { replace: true, trigger: true });
                };

                var title = context.title;
                var url = window.location.toString() + '?experience_id=' + context.experienceId;
                
                xApiRequestManager.init("Anonymous user", "anonymous@easygenerator.com", title, url);

                return router.activate('home').then(function () {
                    app.trigger(events.courseStarted);
                });
            });
        };

    return {
        router: router,
        cssName: cssName,
        homeModule: homeModule,
        activate: activate
    };
});