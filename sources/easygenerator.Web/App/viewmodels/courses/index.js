define(['viewmodels/shell', 'durandal/app', 'constants'], function (shell, app, constants) {


    var childRouter = shell.router.createChildRouter()
       .makeRelative({
           fromParent: true,
       }).map([
           { route: '', moduleId: 'viewmodels/courses/courses', title: 'Hello World', type: 'intro', nav: true, hash: '#courses' },
           { route: ':courseId*details', moduleId: 'viewmodels/courses/course/index', title: 'Hello World', type: 'intro', nav: true, hash: '#courses/:courseId' }
       ]).buildNavigationModel();


    var subscriptions = [];

    childRouter.isViewReady = ko.observable();
    childRouter.on('router:navigation:processing').then(function (instruction, router) {
        if (instruction.config.moduleId !== router.isViewReady()) {
            console.log('COURSES FALSE');
            router.isViewReady(false);
        }
    });
    childRouter.on('router:navigation:composition-complete').then(function (instance, instruction, router) {
        setTimeout(function () {
            console.log('COURSES COMPOSITION COMPLETE ' + instance.__moduleId__);
            router.isViewReady(instance.__moduleId__);
        }, 250);
    });


    return {
        router: childRouter,
        activate: function () {
            console.warn('viewmodels/courses/index');

        },
        attached: function (element) {
            $(element).css({
                'padding-left': '300px'
            });
            var expand = function () {
                $(element).finish().animate({
                    'padding-left': '300px',
                }, 400);
            }

            var collapse = function () {
                $(element).finish().animate({
                    'padding-left': '50px',
                }, 400);
            }

            subscriptions.push(app.on(constants.messages.treeOfContent.expanded).then(expand));
            subscriptions.push(app.on(constants.messages.treeOfContent.collapsed).then(collapse));



        },
        detached: function () {
            subscriptions.forEach(function (subscription) {
                subscription.off();
            });
        }
    };

})