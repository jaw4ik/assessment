define([], function () {

    return [
        {
            route: ['questions'],
            moduleId: 'viewmodels/questions',
            title: 'Questions',
            rootLinkDisabled: true
        },
        {
            route: ['', 'introduction'],
            moduleId: 'viewmodels/introduction',
            title: 'Introduction',
            hideNav: true,
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