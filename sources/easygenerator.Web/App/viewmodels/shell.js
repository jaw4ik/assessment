define(function (require) {

    var app = require('durandal/app'),
        composition = require('durandal/composition'),
        router = require('plugins/router'),
        routes = require('routing/routes'),
        dataContext = require('dataContext'),
        userContext = require('userContext'),
        eventTracker = require('eventTracker'),
        clientContext = require('clientContext'),
        localizationManager = require('localization/localizationManager'),
        uiLocker = require('uiLocker'),
        routingContext = require('routing/routingContext'),

        help = require('help/helpHint'),
        helpHintPositioning = require('help/helpHintPositioning')
    ;

    var events = {
        navigateToCourses: "Navigate to courses",
        navigateToObjectives: 'Navigate to objectives'
    };

    var requestsCounter = ko.observable(0);

    app.on('httpWrapper:post-begin').then(function () {
        requestsCounter(requestsCounter() + 1);
    });

    app.on('httpWrapper:post-end').then(function () {
        requestsCounter(requestsCounter() - 1);
    });

    var
        coursesModule = 'courses',
        introductionPage = 'welcome',
        objectivesModules = ['objectives', 'objective', 'createObjective', 'createQuestion', 'question'],
        coursesModules = ['courses', 'createCourse', 'course', 'design', 'deliver'],
        isViewReady = ko.observable(false),

        activeModule = ko.computed(function () {
            var activeItem = router.activeItem();
            if (_.isObject(activeItem)) {
                var moduleId = activeItem.__moduleId__;
                moduleId = moduleId.slice(moduleId.lastIndexOf('/') + 1);
                return moduleId;
            }
            return '';
        }),

        navigation = ko.observableArray([]),

        showNavigation = function () {
            return _.contains(['404', '400'], this.activeModuleName());
        },

        showCourseNavigation = ko.observable(),

        showTreeOfContent = ko.observable(),

        isTryMode = false,
        username = null,

        activate = function () {
            var that = this;
            return dataContext.initialize()
                .then(function () {

                    router.guardRoute = function (routeInfo, params) {
                        if (dataContext.userSettings.isShowIntroduction && clientContext.get('isShowIntroductionPage')) {
                            clientContext.set('isShowIntroductionPage', false);
                            return introductionPage;
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

                    router.on('router:route:activating').then(function () {
                        isViewReady(false);


                        composition.current.complete(function () {
                            isViewReady(true);
                        });

                        var activeModuleId = routingContext.moduleName();
                        var hasCourseId = routingContext.courseId() != null;

                        that.showCourseNavigation(hasCourseId);
                        that.showTreeOfContent(_.contains(coursesModules, activeModuleId) || hasCourseId);

                        that.navigation()[0].isPartOfModules(_.contains(coursesModules, activeModuleId) || hasCourseId);
                        that.navigation()[1].isPartOfModules(_.contains(objectivesModules, activeModuleId) && !hasCourseId);
                    });

                    that.navigation([
                        {
                            navigate: function () {
                                eventTracker.publish(events.navigateToCourses);
                                clientContext.set('lastVisitedObjective', null);
                                router.navigate('courses');
                            },
                            navigationLink: '#courses',
                            title: 'courses',
                            isActive: ko.computed(function () {
                                return _.contains(coursesModules, that.activeModuleName()) || router.isNavigating();
                            }),
                            isEditor: ko.computed(function () {
                                return _.contains(_.without(coursesModules, 'courses'), that.activeModuleName());
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
                                return _.contains(objectivesModules, that.activeModuleName()) || router.isNavigating();
                            }),
                            isEditor: ko.computed(function () {
                                return _.contains(_.without(objectivesModules, 'objectives'), that.activeModuleName());
                            }),
                            isPartOfModules: ko.observable(false)
                        }
                    ]);

                    that.isTryMode = !_.isObject(userContext.identity);

                    if (!that.isTryMode) {
                        that.username = _.isEmptyOrWhitespace(userContext.identity.fullname)
                            ? userContext.identity.email
                            : userContext.identity.fullname;
                    }

                    clientContext.set('lastVisitedObjective', null);
                    clientContext.set('lastVistedCourse', null);

                    return router.map(routes)
                        .buildNavigationModel()
                        .mapUnknownRoutes('viewmodels/errors/404', '404')
                        .activate(coursesModule);
                });
        };

    return {
        activate: activate,
        activeModuleName: activeModule,
        router: router,
        homeModuleName: coursesModule,

        isViewReady: isViewReady,

        showNavigation: showNavigation,
        showCourseNavigation: showCourseNavigation,
        showTreeOfContent: showTreeOfContent,
        navigation: navigation,
        isTryMode: isTryMode,

        username: username,

        help: help
    };
}
);