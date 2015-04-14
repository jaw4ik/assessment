define(['viewmodels/shell', 'routing/isViewReadyMixin'], function (shell, isViewReady) {

    var childRouter = shell.router.createChildRouter()
       .makeRelative({
           fromParent: true
       }).map([
           { route: '', moduleId: 'viewmodels/objectives/objectives', title: 'Objectives', settings: { localizationKey: 'learningObjectives' } },
           { route: ':objectiveId', moduleId: 'viewmodels/objectives/objective', title: 'Learning Objective', settings: { localizationKey: 'objectiveProperties' } },
           { route: ':objectiveId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: 'Question', settings: { localizationKey: 'questionProperties' } }
       ]).buildNavigationModel();

    isViewReady.assign(childRouter);

    return {
        router: childRouter
    };

})