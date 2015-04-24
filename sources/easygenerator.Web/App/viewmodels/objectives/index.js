﻿define(['viewmodels/shell', 'routing/isViewReadyMixin', 'localization/localizationManager'], function (shell, isViewReady, localizationManager) {

    var childRouter = shell.router.createChildRouter()
        .makeRelative({
            fromParent: true
        }).map([
            { route: '', moduleId: 'viewmodels/objectives/objectives', title: localizationManager.localize('learningObjectives') },
            { route: ':objectiveId', moduleId: 'viewmodels/objectives/objective', title: localizationManager.localize('objectiveProperties') },
            { route: ':objectiveId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: localizationManager.localize('questionProperties') }
        ]).buildNavigationModel();

    isViewReady.assign(childRouter);

    return {
        router: childRouter
    };

});