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


    return {
        router: childRouter,
        activate: function () {
            //debugger;
        }
    };

})