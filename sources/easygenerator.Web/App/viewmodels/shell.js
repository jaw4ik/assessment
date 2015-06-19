define(['durandal/app', 'plugins/router', 'routing/isViewReadyMixin', 'dataContext', 'userContext', 'eventTracker', 'clientContext', 'localization/localizationManager', 'uiLocker', 'plugins/dialog', 'notify', 'constants', 'viewmodels/panels/leftSideBarManager'],
    function (app, router, isViewReady, dataContext, userContext, eventTracker, clientContext, localizationManager, uiLocker, dialog, notify, constants, leftSideBarManager) {

        "use strict";

        var events = {
            navigateToLearningPaths: 'Navigate to learning paths',
            navigateToCourses: "Navigate to courses",
            navigateToMyMaterials: "Navigate to my materials"
        };

        var requestsCounter = ko.observable(0);
        var isFirstVisitPage = true;

        var viewModel = {
            activate: activate,
            router: router,
            homeModuleName: 'courses',
            showNavigation: showNavigation,

            navigation: ko.observableArray([]),
            courseDeleted: courseDeleted,
            objectivesUnrelated: objectivesUnrelated,
            questionsDeleted: questionsDeleted,
            courseCollaborationFinished: courseCollaborationFinished,
            openUpgradePlanUrl: openUpgradePlanUrl,
            leftSideBarManager: leftSideBarManager
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

        app.on('apiHttpWrapper:post-begin').then(function () {
            requestsCounter(requestsCounter() + 1);
        });

        app.on('authHttpWrapper:post-begin').then(function () {
            requestsCounter(requestsCounter() + 1);
        });

        app.on('storageHttpWrapper:post-begin').then(function () {
            requestsCounter(requestsCounter() + 1);
        });

        app.on('storageHttpWrapper:get-begin').then(function () {
            requestsCounter(requestsCounter() + 1);
        });

        app.on('apiHttpWrapper:post-end').then(function () {
            requestsCounter(requestsCounter() - 1);
        });

        app.on('authHttpWrapper:post-end').then(function () {
            requestsCounter(requestsCounter() - 1);
        });

        app.on('storageHttpWrapper:post-end').then(function () {
            requestsCounter(requestsCounter() - 1);
        });

        app.on('storageHttpWrapper:get-end').then(function () {
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
                    router.guardRoute = function (routeInfo) {
                        if (isFirstVisitPage && routeInfo.__moduleId__ == "viewmodels/errors/404") {
                            return 'courses';
                        }

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

                    leftSideBarManager.initialize();

                    router.on('router:navigation:composition-complete').then(function () {
                        clientContext.set(hex_md5(userContext.identity.email), { hash: window.location.hash });
                    });


                    clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);
                    clientContext.set(constants.clientContextKeys.lastVistedCourse, null);

                    var compositionComplete = router.on('router:navigation:composition-complete').then(function () {
                        isFirstVisitPage = false;
                        compositionComplete.off();
                    });

                    router.setDefaultLocationHash(clientContext.get(hex_md5(userContext.identity.email)));

                    router.map([
                        {
                            route: ['', 'courses*details'],
                            moduleId: 'viewmodels/courses/index',
                            title: localizationManager.localize('courses'),
                            hash: '#courses',
                            nav: true,
                            navigate: function () {
                                eventTracker.publish(events.navigateToCourses);
                                clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);
                                router.navigate(this.hash);
                            }
                        },
                        {

                            route: 'learningpaths*details',
                            moduleId: 'viewmodels/learningPaths/index',
                            title: localizationManager.localize('learningPaths'),
                            hash: '#learningpaths',
                            nav: true,
                            isInBetaPhase: true,
                            navigate: function () {
                                eventTracker.publish(events.navigateToLearningPaths);
                                clientContext.set(constants.clientContextKeys.lastVistedCourse, null);
                                clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);
                                router.navigate(this.hash);
                            }
                        },
                        {
                            route: 'library*details',
                            moduleId: 'viewmodels/library/index',
                            title: localizationManager.localize('materials'),
                            hash: '#library',
                            nav: true,
                            navigate: function () {
                                eventTracker.publish(events.navigateToMyMaterials);
                                clientContext.set(constants.clientContextKeys.lastVistedCourse, null);
                                router.navigate(this.hash);
                            }
                        },
                        {
                            route: '404',
                            moduleId: 'viewmodels/errors/404',
                            title: '404 Not Found'
                        }
                    ]);

                    isViewReady.assign(router);

                    viewModel.router.isViewReady.subscribe(function (value) {
                        if (value && !_.isNullOrUndefined(clientContext.get('showCreateCoursePopup'))) {
                            dialog.show('dialogs/createCourse').then(function () {
                                clientContext.remove('showCreateCoursePopup');
                            });
                        }
                    });

                    return router.buildNavigationModel()
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