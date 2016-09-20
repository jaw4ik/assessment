﻿define(['durandal/app', 'routing/router', 'routing/isViewReadyMixin', 'dataContext', 'userContext', 'eventTracker', 'clientContext', 'localization/localizationManager', 'uiLocker', 'plugins/dialog',
    'notify', 'constants', 'viewmodels/panels/leftSideBarManager', 'plugins/widget', 'dialogs/releaseNotes/releaseNotes', 'http/apiHttpWrapper',
'editor/dialogs/editorFeedback/editorFeedback'],
    function (app, router, isViewReady, dataContext, userContext, eventTracker, clientContext, localizationManager, uiLocker, dialog, notify,
        constants, leftSideBarManager, widget, releaseNotesDialog, httpWrapper, editorFeedbackDialog) {

        "use strict";

        var events = {
            navigateToLearningPaths: 'Navigate to learning paths',
            navigateToCourses: "Navigate to courses",
            navigateToMyMaterials: "Navigate to my materials",
            switchToTheNewCourseEditor: "Switch to the new course editor",
            switchToTheOldCourseEditor: "Switch to the old course editor"
        };

        var viewModel = {
            activate: activate,
            router: router,
            homeModuleName: 'courses',
            showNavigation: showNavigation,
            showUpgradeNowLink: ko.observable(true),

            navigation: ko.observableArray([]),

            switchEditorMessageVisible: ko.observable(true),
            newEditor: ko.observable(false),
            switchEditor: switchEditor,
            closeSwitchEditorMessage: closeSwitchEditorMessage,

            courseDeleted: courseDeleted,
            sectionsUnrelated: sectionsUnrelated,
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

        viewModel.isCourseExamplesView = ko.computed(function() {
            var instruction = router.activeInstruction();
            if (_.isObject(instruction)) {
                var fragment = instruction.fragment;
                return fragment === 'start/examples';
            }
            return false;
        });

        app.on(constants.messages.course.deletedByCollaborator, viewModel.courseDeleted);
        app.on(constants.messages.course.collaboration.finishedByCollaborator, viewModel.courseCollaborationFinished);
        app.on(constants.messages.course.sectionsUnrelatedByCollaborator, viewModel.sectionsUnrelated);
        app.on(constants.messages.question.deletedByCollaborator, viewModel.questionsDeleted);
        app.on(constants.messages.user.planChanged, checkUpgradeNowVisibility);

        return viewModel;

        function checkUpgradeNowVisibility() {
            viewModel.showUpgradeNowLink(userContext.hasFreeAccess() || userContext.hasTrialAccess());
        }

        function showNavigation() {
            return _.contains(['404'], this.activeModuleName());
        }

        function openUpgradePlanUrl() {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.header);
            router.openUrl(constants.upgradeUrl);
        }

        function activate() {
            checkUpgradeNowVisibility();

            return dataContext.initialize()
                .then(function () {
                    leftSideBarManager.initialize();

                    router.on('router:navigation:processing').then(function () {
                        _.each(CKEDITOR.instances, function (instance) {
                            try {
                                instance.destroy(true);
                            } catch (e) {
                            }
                        });
                    });
                    router.on('router:navigation:composition-complete').then(function () {
                        clientContext.set(hex_md5(userContext.identity.email), { hash: window.location.hash });
                    });

                    router.on('router:route:activating').then(function (instance, instruction) {
                        var editorStateKey = userContext.identity.email + (userContext.identity.newEditor ? constants.newCourseEditor.switchToOldEditorMessageClosed : constants.newCourseEditor.switchToNewEditorMessageClosed);
                        viewModel.switchEditorMessageVisible(!userContext.identity.isNewEditorByDefault && !clientContext.get(editorStateKey) && constants.patterns.coursePage.test(instruction.fragment));
                    });

                    clientContext.set(constants.clientContextKeys.lastVisitedSection, null);
                    clientContext.set(constants.clientContextKeys.lastVistedCourse, null);

                    if (_.isObject(userContext.identity)) {
                        var isShowStartView = !_.isNullOrUndefined(clientContext.get(constants.clientContextKeys.showCreateCourseView));

                        router.setDefaultLocationHash(isShowStartView ? { hash: 'start' } : clientContext.get(hex_md5(userContext.identity.email)));
                        viewModel.newEditor(userContext.identity.newEditor);
                    }

                    router.map([
                        {
                            route: ['', 'courses*details'],
                            moduleId: 'viewmodels/courses/index',
                            title: localizationManager.localize('courses'),
                            hash: '#courses',
                            nav: true,
                            navigate: function () {
                                eventTracker.publish(events.navigateToCourses);
                                clientContext.set(constants.clientContextKeys.lastVisitedSection, null);
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
                                clientContext.set(constants.clientContextKeys.lastVisitedSection, null);
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
                            route: 'organizations*details',
                            moduleId: 'organizations/index',
                            title: localizationManager.localize('organization')
                        },
                        {
                            route: 'start*details',
                            moduleId: 'examples/index',
                            title: localizationManager.localize('createYourFirstCourse')
                        },
                        {
                            route: 'wintoweb',
                            moduleId: 'wintoweb/index',
                            title: 'Coverter from windows edition to web'
                        },
                        {
                            route: 'importfrompresentation',
                            moduleId: 'importfrompresentation/index',
                            title: 'Import from PowerPoint'
                        },
                        {
                            route: '404',
                            moduleId: 'viewmodels/errors/404',
                            title: '404 Not Found'
                        }
                    ]);

                    isViewReady.assign(router);

                    viewModel.router.isViewReady.subscribe(function (value) {
                        if (value) {
                            if (userContext.identity.showReleaseNote) {
                                releaseNotesDialog.show();
                            } 
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

        function sectionsUnrelated(courseId, deletedSectionIds) {
            if (_.isNullOrUndefined(router.routeData().courseId) || _.isNullOrUndefined(router.routeData().sectionId) || !_.contains(deletedSectionIds, router.routeData().sectionId))
                return;

            notify.error(localizationManager.localize('sectionHasBeenDisconnectedByCollaborator'));
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

        function switchEditor() {
            if (viewModel.newEditor()) {
                eventTracker.publish(events.switchToTheOldCourseEditor);
                editorFeedbackDialog.show(doSwitchEditor);
            } else {
                eventTracker.publish(events.switchToTheNewCourseEditor);
                doSwitchEditor();
            }
        }

        function doSwitchEditor() {
            return httpWrapper.post('api/user/switcheditor').then(function () {
                var locationHash = router.getLocationHash();
                if (constants.patterns.coursePage.test(locationHash)) {
                    var hash = 'courses/',
                        pageHash = constants.patterns.coursePage.exec(locationHash)[0];
                    if (pageHash) {
                        hash += pageHash.substring(hash.length);
                    }
                    router.setLocationHash(hash);
                }
                router.reloadLocation();
            });
        }

        function closeSwitchEditorMessage() {
            clientContext.set(userContext.identity.email + (viewModel.newEditor() ? constants.newCourseEditor.switchToOldEditorMessageClosed : constants.newCourseEditor.switchToNewEditorMessageClosed), true);
            viewModel.switchEditorMessageVisible(false);
        }
    }
);