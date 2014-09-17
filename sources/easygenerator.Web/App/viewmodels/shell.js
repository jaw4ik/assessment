define(['durandal/app', 'durandal/composition', 'plugins/router', 'routing/routes', 'dataContext', 'userContext', 'eventTracker', 'clientContext',
    'localization/localizationManager', 'uiLocker', 'help/helpHint', 'plugins/dialog', 'notify', 'constants'],
    function (app, composition, router, routes, dataContext, userContext, eventTracker, clientContext, localizationManager, uiLocker, help, dialog, notify, constants) {

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
            help: help,
            courseDeleted: courseDeleted,
            objectivesUnrelated: objectivesUnrelated,
            questionsDeleted: questionsDeleted,
            courseCollaborationFinished: courseCollaborationFinished,
            openUpgradePlanUrl: openUpgradePlanUrl
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

        viewModel.isViewReady.subscribe(function (value) {
            if (value && !_.isNullOrUndefined(clientContext.get('showCreateCoursePopup'))) {
                dialog.show('dialogs/createCourse').then(function () {
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

        app.on(constants.messages.course.deletedByCollaborator, viewModel.courseDeleted);
        app.on(constants.messages.course.collaboration.finished, viewModel.courseCollaborationFinished);
        app.on(constants.messages.course.objectivesUnrelatedByCollaborator, viewModel.objectivesUnrelated);
        app.on(constants.messages.question.deletedByCollaborator, viewModel.questionsDeleted);

        return viewModel;

        function showNavigation() {
            return _.contains(['404'], this.activeModuleName());
        }

        function openUpgradePlanUrl() {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.header);
            router.openUrl(constants.upgradeUrl);
        }

        function activate() {
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

                    router.on('router:navigation:composition-complete').then(function () {
                        var activeModuleId = router.routeData().moduleName;
                        var hasCourseId = router.routeData().courseId != null;

                        viewModel.showCourseNavigation(hasCourseId);
                        viewModel.showTreeOfContent(_.contains(coursesModules, activeModuleId) || hasCourseId);

                        viewModel.navigation()[0].isPartOfModules(_.contains(coursesModules, activeModuleId) || hasCourseId);
                        viewModel.navigation()[1].isPartOfModules(_.contains(objectivesModules, activeModuleId) && !hasCourseId);
                    });

                    router.on('router:route:activating').then(function () {
                        viewModel.isViewReady(false);
                    });

                    viewModel.navigation([
                        {
                            navigate: function () {
                                eventTracker.publish(events.navigateToCourses);
                                clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);
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
                                clientContext.set(constants.clientContextKeys.lastVistedCourse, null);
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

                    clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);
                    clientContext.set(constants.clientContextKeys.lastVistedCourse, null);

                    return router.map(routes)
                        .buildNavigationModel()
                        .mapUnknownRoutes('viewmodels/errors/404', '404')
                        .activate(viewModel.homeModuleName);
                });
        }

        function courseDeleted(courseId) {
            if (router.routeData().courseId != courseId)
                return;

            notify.error(localizationManager.localize('courseHasBeenDeletedByTheOwner'));
        }

        function objectivesUnrelated(courseId, deletedObjectiveIds) {
            if (_.isNullOrUndefined(router.routeData().courseId) || _.isNullOrUndefined(router.routeData().objectiveId) || !_.contains(deletedObjectiveIds, router.routeData().objectiveId))
                return;

            notify.error(localizationManager.localize('learningObjectiveHasBeenDisconnectedByCollaborator'));
        }

        function questionsDeleted(objId, deletedQuestionIds) {
            if (_.isNullOrUndefined(router.routeData().courseId) || _.isNullOrUndefined(router.routeData().questionId) || !_.contains(deletedQuestionIds, router.routeData().questionId))
                return;

            notify.error(localizationManager.localize('questionHasBeenDeletedByCollaborator'));
        }

        function courseCollaborationFinished(courseId) {
            if (router.routeData().courseId != courseId)
                return;

            notify.error(localizationManager.localize('courseIsNotAvailableAnyMore'));
        }
    }
);