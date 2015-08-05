define(['viewmodels/shell', 'routing/isViewReadyMixin', 'localization/localizationManager'], function (shell, isViewReady, localizationManager) {


    var childRouter = shell.router.createChildRouter()
       .makeRelative({
           fromParent: true,
       }).map([
           {
               route: '',
               moduleId: 'viewmodels/learningPaths/learningPaths/learningPaths',
               hash: '#learningpaths',
               title: localizationManager.localize('learningPaths')
           },
           {
               route: ':learningPathId*details',
               moduleId: 'viewmodels/learningPaths/learningPath/index',
               hash: '#learningpaths/:learningPathId',
               title: localizationManager.localize('learningPathProperties')
           }
       ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();


    isViewReady.assign(childRouter);


    return {
        router: childRouter,
        activate: function() {
        }
    };

})