define(['viewmodels/shell', 'durandal/app', 'constants'], function (shell, app, constants) {


    var childRouter = shell.router.createChildRouter()
       .makeRelative({
           fromParent: true,
       }).map([
           { route: '', moduleId: 'viewmodels/courses/courses', title: 'Hello World', type: 'intro', nav: true, hash: '#courses' },
           { route: ':courseId*details', moduleId: 'viewmodels/courses/course/index', title: 'Hello World', type: 'intro', nav: true, hash: '#courses/:courseId' }
       ]).mapUnknownRoutes('viewmodels/errors/404', '404').buildNavigationModel();


    childRouter.isViewReady = ko.observable();
    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        if (instruction.config.moduleId !== router.isViewReady()) {
            router.isViewReady(false);
        }
    });
    childRouter.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
        if (instance) {
            setTimeout(function () {
                router.isViewReady(instance.__moduleId__);
            }, 250);
        }
    });


    return {
        router: childRouter,
        activate: function () {
            console.warn('viewmodels/courses/index');

        }
    };

})