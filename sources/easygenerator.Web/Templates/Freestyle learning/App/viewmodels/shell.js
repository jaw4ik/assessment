define(['durandal/app', 'plugins/router', 'context', 'events', 'xAPI/xAPIManager'],
    function (app, router, context, events, xAPIManager) {

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

                    xAPIManager.init("Anonymous user", "anonymous@easygenerator.com", title, url);

                    var routes = [
                        {
                            route: '',
                            moduleId: 'viewmodels/home',
                            title: 'Objectives and questions'
                        },
                        {
                            route: '404(/:url)',
                            moduleId: 'viewmodels/404',
                            title: 'Not found'
                        },
                        {
                            route: 'objective/:objectiveId/question/:questionId',
                            moduleId: 'viewmodels/question',
                            title: 'Question'
                        },
                        {
                            route: 'objective/:objectiveId/question/:questionId/feedback',
                            moduleId: 'viewmodels/feedback',
                            title: 'Feedback'
                        },
                        {
                            route: 'objective/:objectiveId/question/:questionId/learningContents',
                            moduleId: 'viewmodels/learningContents',
                            title: 'Learning objects'
                        },
                        {
                            route: 'summary',
                            moduleId: 'viewmodels/summary',
                            title: 'Summary',
                            nav: true,
                            settings: {
                                caption: 'Progress summary&nbsp;<img src="img/progress_summary_white.png" alt="" />'
                            }
                        },
                        {
                            route: 'xapierror(/:backUrl)',
                            moduleId: 'viewmodels/xAPIError',
                            title: 'xAPI Error'
                        }
                    ];

                    return router.map(routes)
                        .buildNavigationModel()
                        .mapUnknownRoutes('viewmodels/404', '404')
                        .activate('')
                        .then(function () {
                            app.trigger(events.courseStarted);
                        });
                });
        }
    };

});