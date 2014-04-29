define(['durandal/app', 'durandal/composition', 'plugins/router', 'routing/routes', 'dataContext', 'userContext', 'eventTracker', 'clientContext', 'localization/localizationManager', 'uiLocker',
    'help/helpHint', 'plugins/dialog'],
    function (app, composition, router, routes, dataContext, userContext, eventTracker, clientContext, localizationManager, uiLocker, help, dialog) {

        "use strict";

        var events = {
            navigateToCourses: "Navigate to courses",
            navigateToObjectives: 'Navigate to objectives'
        };

        var
            objectivesModules = ['objectives', 'objective', 'createObjective', 'createQuestion', 'question'],
            coursesModules = ['courses', 'createCourse', 'course', 'design', 'publish'];

        var requestsCounter = ko.observable(0);

        var viewModel = {
            activate: activate,
            router: router,
            homeModuleName: 'courses',
            isViewReady: ko.observable(false),
            showNavigation: showNavigation,
            showCourseNavigation: ko.observable(),
            showTreeOfContent: ko.observable(),
            navigation: ko.observableArray([]),
            isTryMode: false,
            help: help
        };
    
        viewModel.activeModuleName = ko.computed(function () {
            var activeItem = router.activeItem();
            if (_.isObject(activeItem)) {
                var moduleId = activeItem.__moduleId__;
                moduleId = moduleId.slice(moduleId.lastIndexOf('/') + 1);
                return moduleId;
            }
            return '';
        });

        viewModel.isViewReady.subscribe(function(value) {
            if (value && !_.isNullOrUndefined(clientContext.get('showCreateCoursePopup'))) {
                dialog.show('dialogs/createCourse').then(function() {
                    clientContext.remove('showCreateCoursePopup');
                });
            }
        });

        app.on('httpWrapper:post-begin').then(function () {
            requestsCounter(requestsCounter() + 1);
        });

        app.on('httpWrapper:post-end').then(function () {
            requestsCounter(requestsCounter() - 1);
        });

        return viewModel;

        function showNavigation() {
            return _.contains(['404'], this.activeModuleName());
        }

        function activate () {
            return dataContext.initialize()
                .then(function () {
                    router.guardRoute = function (routeInfo, params) {

                        if (requestsCounter() == 0) {
                            return true;
                        }

                        var defer = Q.defer();
                        uiLocker.lock();
                        checkRequestCounter(defer);

                        return defer.promise;

                        function checkRequestCounter(defer) {
                            if (requestsCounter() > 0) {
                                setTimeout(function () {
                                    checkRequestCounter(defer);
                                }, 100);
                            } else {
                                defer.resolve(true);
                                uiLocker.unlock();
                            }
                        }
                    };

                    router.on('router:route:activating').then(function () {
                        viewModel.isViewReady(false);

                        var activeModuleId = router.routeData().moduleName;
                        var hasCourseId = router.routeData().courseId != null;

                        viewModel.showCourseNavigation(hasCourseId);
                        viewModel.showTreeOfContent(_.contains(coursesModules, activeModuleId) || hasCourseId);

                        viewModel.navigation()[0].isPartOfModules(_.contains(coursesModules, activeModuleId) || hasCourseId);
                        viewModel.navigation()[1].isPartOfModules(_.contains(objectivesModules, activeModuleId) && !hasCourseId);
                    });

                    viewModel.navigation([
                        {
                            navigate: function () {
                                eventTracker.publish(events.navigateToCourses);
                                clientContext.set('lastVisitedObjective', null);
                                router.navigate('courses');
                            },
                            navigationLink: '#courses',
                            title: 'courses',
                            isActive: ko.computed(function () {
                                return _.contains(coursesModules, viewModel.activeModuleName()) || router.isNavigating();
                            }),
                            isEditor: ko.computed(function () {
                                return _.contains(_.without(coursesModules, 'courses'), viewModel.activeModuleName());
                            }),
                            isPartOfModules: ko.observable(false)
                        },
                        {
                            navigate: function () {
                                eventTracker.publish(events.navigateToObjectives);
                                clientContext.set('lastVistedCourse', null);
                                router.navigate('objectives');
                            },
                            navigationLink: '#objectives',
                            title: 'materials',
                            isActive: ko.computed(function () {
                                return _.contains(objectivesModules, viewModel.activeModuleName()) || router.isNavigating();
                            }),
                            isEditor: ko.computed(function () {
                                return _.contains(_.without(objectivesModules, 'objectives'), viewModel.activeModuleName());
                            }),
                            isPartOfModules: ko.observable(false)
                        }
                    ]);
                    viewModel.isTryMode = !_.isObject(userContext.identity);

                    clientContext.set('lastVisitedObjective', null);
                    clientContext.set('lastVistedCourse', null);

                    return router.map(routes)
                        .buildNavigationModel()
                        .mapUnknownRoutes('viewmodels/errors/404', '404')
                        .activate(viewModel.homeModuleName);
                });
        }
    }
);