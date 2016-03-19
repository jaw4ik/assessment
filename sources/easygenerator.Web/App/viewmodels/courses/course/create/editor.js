define(['viewmodels/courses/course/index', 'localization/localizationManager'], function (index, localizationManager) {
    "use strict";

    return index.router.createChildRouter()
        .makeRelative({
            fromParent: true,
            dynamicHash: ':courseId'
        }).map([
            { route: '', moduleId: 'viewmodels/courses/course/create/course', title: localizationManager.localize('courseCreateItem') },
            { route: 'sections/:sectionId', moduleId: 'viewmodels/sections/section', title: localizationManager.localize('sectionProperties') },
            { route: 'sections/:sectionId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: localizationManager.localize('questionProperties') }
        ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();
});