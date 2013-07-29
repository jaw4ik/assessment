define(['durandal/plugins/router', 'context'], function (router, context) {

    return {
        router: router,
        activate: function () {

            router.useConvention();

            router.map([
                {
                    url: '#/',
                    moduleId: 'viewmodels/home',
                    name: 'Objectives and questions'
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
                    moduleId: 'viewmodels/explanation',
                    name: 'Explanation'
                },
                {
                    url: '#/summary',
                    moduleId: 'viewmodels/summary',
                    name: 'Summary'
                }
            ]);

            return context.initialize().then(function () {
                return router.activate('#/');
            });
        }
    };

});