define(['viewmodels/courses/course/index', 'localization/localizationManager'], function (index, localizationManager) {
    "use strict";

    return index.router.createChildRouter()
        .makeRelative({
            fromParent: true,
            dynamicHash: ':courseId'
        }).map([
            { route: '', moduleId: 'viewmodels/courses/course/create/course', title: localizationManager.localize('courseCreateItem') },
            { route: 'objectives/:objectiveId', moduleId: 'viewmodels/objectives/objective', title: localizationManager.localize('objectiveProperties') },
            { route: 'objectives/:objectiveId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: localizationManager.localize('questionProperties') }
        ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();
});