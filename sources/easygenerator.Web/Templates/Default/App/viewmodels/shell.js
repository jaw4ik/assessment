define(['durandal/plugins/router', 'context'], function (router, context) {
    

    return {
        router: router,
        showNavigation: ko.computed(function () {
            var activeItem = router.activeItem();
            if (_.isObject(activeItem)) {
                return activeItem.__moduleId__ != 'viewmodels/summary';
            }
            return true;
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
                    url: 'summary',
                    moduleId: 'viewmodels/summary',
                    name: 'Summary',                    
                }
            ]);

            router.handleInvalidRoute = function (route) {
                router.replaceLocation("#/404/" + encodeURIComponent(route));
            };

            return context.initialize()
                .then(function () {
                    //window.location.hash = '#/';
                    return router.activate();
                });
        }
    };

});