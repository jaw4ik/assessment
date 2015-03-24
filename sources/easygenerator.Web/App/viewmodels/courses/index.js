define(['viewmodels/shell', 'durandal/app', 'constants'], function (shell, app, constants) {


    var childRouter = shell.router.createChildRouter()
       .makeRelative({
           fromParent: true
       }).map([
           { route: '', moduleId: 'viewmodels/courses/courses', title: 'Hello World', type: 'intro', nav: true },
           { route: ':courseId*details', moduleId: 'viewmodels/courses/course/index', title: 'Hello World', type: 'intro', nav: true }
       ]).buildNavigationModel();

  
    var subscriptions = [];

    return {
        router: childRouter,
        activate: function () {


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


            //var handler = function () {
            //    if ($(window).width() < 1560) {
            //        $(element).css({
            //            'padding-left': '300px',
            //            'padding-right': '300px'
            //        });
            //    } else {
            //        $(element).css({
            //            'padding-left': '0',
            //            'padding-right': '0'
            //        });
            //    }
            //}

            //handler();
            //$(window).on('resize', _.debounce(handler));


        },
        detached: function () {
            subscriptions.forEach(function (subscription) {
                subscription.off();
            });
        }
    };

})