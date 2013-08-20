define(['durandal/plugins/router', 'context', 'eventTracker'], function (router, context, eventTracker) {
    

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

            router.useConvention();
            router.map([
                {
                    url: '#/',
                    moduleId: 'viewmodels/home',
                    name: 'Objectives and questions'
                },
                {
                    url: '#/404',
                    moduleId: 'viewmodels/404',
                    name: 'Not found'
                },
                {
                    url: '#/404/:url',
                    moduleId: 'viewmodels/404',
                    name: 'Not found'
                },
                {
                    url: '#/objective/:objectiveId/question/:questionId',
                    moduleId: 'viewmodels/question',
                    name: 'Question'
                },
                {
                    url: '#/objective/:objectiveId/question/:questionId/feedback',
                    moduleId: 'viewmodels/feedback',
                    name: 'Feedback'
                },
                {
                    url: '#/objective/:objectiveId/question/:questionId/explanations',
                    moduleId: 'viewmodels/explanations',
                    name: 'Explanation'
                },
                {
                    url: '#/summary',
                    moduleId: 'viewmodels/summary',
                    name: 'Summary',
                    visible: true,
                    settings: {
                        caption: 'Progress summary&nbsp;<img src="img/progress_summary_white.png" alt="" />'
                    }
                },
                {
                    url: '#/xapierror',
                    moduleId: 'viewmodels/xAPIError',
                    name: 'xAPIError'
                }
            ]);

            router.handleInvalidRoute = function (route) {
                router.replaceLocation("#/404/" + encodeURIComponent(route));
            };

            return context.initialize()
                .then(function () {
                    window.location.hash = '#/';

                    return router.activate().then(function() {
                        eventTracker.courseStarted();
                    });
                });
        }
    };

});