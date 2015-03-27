define(['viewmodels/courses/index'], function (index) {

    return {
        create: create
    };

    function create() {
        var childRouter = index.router.createChildRouter()
          .makeRelative({
              fromParent: true,
              dynamicHash: ':courseId'
          }).map([
              { route: 'design', moduleId: 'viewmodels/courses/course/design', title: 'Design', nav: 2 },
              { route: 'publish', moduleId: 'viewmodels/courses/course/publish', title: 'Publish', nav: 3 },
              { route: 'results', moduleId: 'viewmodels/courses/course/results', title: 'Results', nav: 4 },

              { route: ['', '*details'], moduleId: 'viewmodels/courses/course/create/index', title: 'Create', nav: 1 }
          ]).buildNavigationModel();

        return childRouter;
    }
})