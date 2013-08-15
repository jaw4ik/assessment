define(['durandal/plugins/router', 'context'], function (router, context) {

    return {
        router: router,
        activate: function () {

            router.useConvention();

            router.map([
                {
                    url: '#/',
                    moduleId: 'viewmodels/home',
                    name: 'Question'
                },
                {
                    url: '#/summary',
                    moduleId: 'viewmodels/summary',
                    name: 'Summary'
                },
                {
                    url: '#/objective/:objectiveId/question/:questionId/explanations',
                    moduleId: 'viewmodels/explanations',
                    name: 'Explanations'
                },
                {
                    url: '#/404',
                    moduleId: 'viewmodels/404',
                    name: '404 Not found'
                },
                {
                    url: '#/400',
                    moduleId: 'viewmodels/400',
                    name: '400 Bad Request'
                }
            ]);

            return context.initialize().then(function () {                
                return router.activate('#/');
            });
        }
    };
});