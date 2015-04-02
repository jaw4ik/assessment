define(['viewmodels/shell'], function (shell) {

    var childRouter = shell.router.createChildRouter()
       .makeRelative({
           fromParent: true
       }).map([
           { route: '', moduleId: 'viewmodels/objectives/objectives', title: 'Hello World' },
           { route: ':objectiveId', moduleId: 'viewmodels/objectives/objective', title: 'Learning Objective', settings: { localizationKey: 'objectiveProperties' } },
           { route: ':objectiveId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: 'Question', settings: { localizationKey: 'questionProperties' } }
       ]).buildNavigationModel();

    return {
        router: childRouter,
        activate: function () {
        }
    };

})