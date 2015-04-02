define(['viewmodels/courses/course/index'], function (index) {


    var childRouter = index.router.createChildRouter()
      .makeRelative({
          fromParent: true,
          dynamicHash: ':courseId'
      }).map([
          { route: '', moduleId: 'viewmodels/courses/course/create/course', settings: { localizationKey: 'objectiveProperties' } },
          { route: 'objectives/:objectiveId', moduleId: 'viewmodels/objectives/objective', title: 'Learning Objective', settings: { localizationKey: 'objectiveProperties' } },
          { route: 'objectives/:objectiveId/question/:questionId', moduleId: 'viewmodels/questions/question', title: 'Question', settings: { localizationKey: 'questionProperties' } }
      ]).buildNavigationModel();


    childRouter.isViewReady = ko.observable();
    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        if (instruction.config.moduleId !== router.isViewReady()) {
            router.isViewReady(false);
        }
    });
    childRouter.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
        setTimeout(function () {
            router.isViewReady(instance.__moduleId__);
        }, 250);
    });


    return {
        router: childRouter,
        activate: function () {
            //console.warn('viewmodels/courses/course/create/index');
            //debugger;
        }
    };

})