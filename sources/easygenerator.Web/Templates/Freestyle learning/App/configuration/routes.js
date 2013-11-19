define([], function () {

    return [
        {
            route: ['', 'home'],
            moduleId: 'viewmodels/home',
            title: 'Objectives and questions',
            rootLinkDisabled: true
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
        }
    ];

});