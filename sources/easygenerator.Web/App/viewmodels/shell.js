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

        help = require('help/helpHint')
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
        coursesModules = ['courses', 'course', 'createCourse'],
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

        getModuleIdFromRouterActiveInstruction = function () {
            var activeInstruction = router.activeInstruction();
            if (_.isObject(activeInstruction)) {
                var moduleId = router.activeInstruction().config.moduleId;
                return moduleId.slice(moduleId.lastIndexOf('/') + 1);
            }
            return '';
        },


        browserCulture = ko.observable(),

        navigation = ko.observableArray([]),

        showNavigation = function () {
            return _.contains(['404', '400'], this.activeModuleName());
        },

        isTryMode = false,
        username = null,

        activate = function () {
            composition.addBindingHandler('fixedBlocksPosition');

            var that = this;
            return dataContext.initialize()
                .then(function () {
                    browserCulture(localizationManager.currentLanguage);

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
                                setTimeout(function() {
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
                        that.navigation()[0].isPartOfModules(_.contains(coursesModules, getModuleIdFromRouterActiveInstruction()));
                        that.navigation()[1].isPartOfModules(_.contains(objectivesModules, getModuleIdFromRouterActiveInstruction()));
                    });

                    router.on('router:navigation:composition-complete').then(function () {
                        isViewReady(true);
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
                            title: 'materialDevelopment',
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
        browserCulture: browserCulture,
        router: router,
        homeModuleName: coursesModule,

        isViewReady: isViewReady,

        showNavigation: showNavigation,
        navigation: navigation,
        isTryMode: isTryMode,

        username: username,

        help: help
    };
}
);