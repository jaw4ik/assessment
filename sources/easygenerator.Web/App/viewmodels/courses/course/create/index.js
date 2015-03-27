define(['viewmodels/courses/course/index'], function (index) {


    var childRouter = index.router.createChildRouter()
      .makeRelative({
          fromParent: true,
          dynamicHash: ':courseId'
      }).map([
          { route: '', moduleId: 'viewmodels/courses/course/course', settings: { localizationKey: 'objectiveProperties' } },
          { route: 'objectives/:objectiveId', moduleId: 'viewmodels/objectives/objective', title: 'Learning Objective', settings: { localizationKey: 'objectiveProperties' } },
          { route: 'objectives/:objectiveId/question/:questionId', moduleId: 'viewmodels/questions/question', title: 'Question', settings: { localizationKey: 'questionProperties' } }
      ]).buildNavigationModel();


    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        console.warn('router:navigation:processing  -  course/course/create/index');
    });

    childRouter.isNavigating.subscribe(function (newValue) {
        console.log('isNavigating: ' + newValue);
    });

    return {
        router: childRouter,
        activate: function () {
            console.warn('viewmodels/courses/course/create/index');
            //debugger;
        }
    };

})