define(['viewmodels/courses/course/index', 'repositories/courseRepository', 'repositories/objectiveRepository'], function (index, courseRepository, objectiveRepository) {


    var childRouter = index.router.createChildRouter()
      .makeRelative({
          fromParent: true,
          dynamicHash: ':courseId'
      }).map([
          { route: '', moduleId: 'viewmodels/courses/course/create/course', settings: { localizationKey: 'objectiveProperties' } },
          { route: 'objectives/:objectiveId', moduleId: 'viewmodels/objectives/objective', title: 'Learning Objective', settings: { localizationKey: 'objectiveProperties' } },
          { route: 'objectives/:objectiveId/questions/:questionId', moduleId: 'viewmodels/questions/question', title: 'Question', settings: { localizationKey: 'questionProperties' } }
      ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();


    childRouter.isViewReady = ko.observable();
    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        router.isViewReady(false);
    });
    childRouter.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
        setTimeout(function () {
            router.isViewReady(true);
        }, 250);
    });


    return {
        router: childRouter,
        activate: function () {
            //console.warn('viewmodels/courses/course/create/index');
            //debugger;
        },
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