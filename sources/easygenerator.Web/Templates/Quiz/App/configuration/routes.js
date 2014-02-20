define([], function () {

    return [
        {
            route: ['', 'home'],
            moduleId: 'viewmodels/home',
            title: 'Questions',
            rootLinkDisabled: true
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
        }
    ];

});