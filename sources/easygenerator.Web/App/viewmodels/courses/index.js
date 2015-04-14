define(['viewmodels/shell', 'routing/isViewReadyMixin'], function (shell, isViewReady) {


    var childRouter = shell.router.createChildRouter()
       .makeRelative({
           fromParent: true,
       }).map([
           { route: '', moduleId: 'viewmodels/courses/courses', hash: '#courses', title: 'Courses', settings: { localizationKey: 'courses' } },
           { route: ':courseId*details', moduleId: 'viewmodels/courses/course/index', hash: '#courses/:courseId', title: 'Course', settings: { localizationKey: 'course' } }
       ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();


    isViewReady.assign(childRouter);


    return {
        router: childRouter,
        activate: function () {

        }
    };

})