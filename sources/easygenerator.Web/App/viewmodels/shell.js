define(function (require) {

    var app = require('durandal/app'),
        composition = require('durandal/composition'),
        notify = require('notify'),
        router = require('plugins/router'),
        routes = require('routing/routes'),
        dataContext = require('dataContext'),
        eventTracker = require('eventTracker'),
        clientContext = require('clientContext'),
        localizationManager = require('localization/localizationManager'),
        uiLocker = require('uiLocker'),

        help = require('help/helpHint')
    ;

    var events = {
        navigateToExperiences: "Navigate to experiences",
        navigateToObjectives: 'Navigate to objectives'
    };

    var requestsCounter = ko.observable(0);

    app.on('httpWrapper:post-begin').then(function () {
        requestsCounter(requestsCounter() + 1);
    });

    app.on('httpWrapper:post-end').then(function () {
        requestsCounter(requestsCounter() - 1);
    });

    var experiencesModule = 'experiences',
        objectivesModules = ['objectives', 'objective', 'createObjective', 'createQuestion', 'question'],
        experiencesModules = ['experiences', 'experience', 'createExperience'],
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
        userEmail = '',

        activate = function () {
            composition.addBindingHandler('fixedBlocksPosition');

            var that = this;
            return dataContext.initialize()
                .then(function () {
                    browserCulture(localizationManager.currentLanguage);

                    router.guardRoute = function (routeInfo, params) {
                        notify.disable();
                        if (requestsCounter() > 0) {
                            //that.navigation()[1].isPartOfModules(_.contains(objectivesModules, that.activeModuleName()));
                            //that.navigation()[0].isPartOfModules(_.contains(experiencesModules, that.activeModuleName()));
                            uiLocker.lock();
                            var subscription = requestsCounter.subscribe(function (newValue) {
                                if (newValue == 0) {
                                    uiLocker.unlock();
                                    var queryString = params.queryString;
                                    if (!_.isNullOrUndefined(queryString)) {
                                        router.navigate(params.fragment + '?' + queryString);
                                    } else {
                                        router.navigate(params.fragment);
                                    }
                                    subscription.dispose();
                                }
                            });
                            return false;
                        }
                        return true;
                    };

                    router.on('router:route:activating').then(function () {
                        isViewReady(false);
                        notify.hide();
                        notify.enable();
                        that.navigation()[0].isPartOfModules(_.contains(experiencesModules, getModuleIdFromRouterActiveInstruction()));
                        that.navigation()[1].isPartOfModules(_.contains(objectivesModules, getModuleIdFromRouterActiveInstruction()));
                    });

                    router.on('router:navigation:composition-complete').then(function () {
                        isViewReady(true);
                    });

                    that.navigation([
                        {
                            navigate: function () {
                                eventTracker.publish(events.navigateToExperiences);
                                clientContext.set('lastVisitedObjective', null);
                                router.navigate('experiences');
                            },
                            navigationLink: '#experiences',
                            title: 'experiences',
                            isActive: ko.computed(function () {
                                return _.contains(experiencesModules, that.activeModuleName()) || router.isNavigating();
                            }),
                            isEditor: ko.computed(function () {
                                return _.contains(_.without(experiencesModules, 'experiences'), that.activeModuleName());
                            }),
                            isPartOfModules: ko.observable(false)
                        },
                        {
                            navigate: function () {
                                eventTracker.publish(events.navigateToObjectives);
                                clientContext.set('lastVistedExperience', null);
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
                    that.isTryMode = dataContext.isTryMode;
                    that.userEmail = dataContext.userEmail;


                    clientContext.set('lastVisitedObjective', null);
                    clientContext.set('lastVistedExperience', null);

                    return router.map(routes)
                        .buildNavigationModel()
                        .mapUnknownRoutes('viewmodels/errors/404', '404')
                        .activate(experiencesModule);
                });
        };

    return {
        activate: activate,
        activeModuleName: activeModule,
        browserCulture: browserCulture,
        router: router,
        homeModuleName: experiencesModule,

        isViewReady: isViewReady,

        showNavigation: showNavigation,
        navigation: navigation,
        isTryMode: isTryMode,

        userEmail: userEmail,

        help: help
    };
}
);