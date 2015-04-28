define(['viewmodels/courses/course/index', 'routing/isViewReadyMixin', 'repositories/courseRepository', 'localization/localizationManager'], function (index, isViewReady, courseRepository, localizationManager) {


    var childRouter = index.router.createChildRouter()
      .makeRelative({
          fromParent: true,
          dynamicHash: ':courseId'
      }).map([
          { route: '', moduleId: 'viewmodels/courses/course/create/course', title: localizationManager.localize('courseCreateItem') },
          { route: 'objectives/:objectiveId', moduleId: 'viewmodels/objectives/objective', title: localizationManager.localize('objectiveProperties') },
          { route: 'objectives/:objectiveId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: localizationManager.localize('questionProperties') }
      ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();


    isViewReady.assign(childRouter, true);

    return {
        router: childRouter,
        activate: function () {},
        canActivate: canActivate
    };

    function canActivate() {
        return courseRepository.getById(arguments[0]).then(function () {
            return true;
        }).catch(function () {
            return { redirect: '404' };
        });
    }

})