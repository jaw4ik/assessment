define(['viewmodels/courses/course/index', 'localization/localizationManager'], function (index, localizationManager) {
    "use strict";

    return index.router.createChildRouter()
        .makeRelative({
            fromParent: true,
            dynamicHash: ':courseId'
        }).map([
            { route: '', moduleId: 'editor/course/index', title: localizationManager.localize('courseCreateItem') }
        ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();
});