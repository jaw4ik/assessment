define(['viewmodels/library/index', 'routing/isViewReadyMixin', 'localization/localizationManager'], function (index, isViewReady, localizationManager) {

    var childRouter = index.router.createChildRouter()
        .makeRelative({
            fromParent: true
        }).map([
            { route: '', moduleId: 'viewmodels/sections/sections', title: localizationManager.localize('sections') },
            { route: ':sectionId', moduleId: 'viewmodels/sections/section', title: localizationManager.localize('sectionProperties') },
            { route: ':sectionId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: localizationManager.localize('questionProperties') }
        ]).buildNavigationModel();

    isViewReady.assign(childRouter);

    return {
        router: childRouter
    };

});