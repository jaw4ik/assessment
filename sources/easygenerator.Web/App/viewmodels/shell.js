define(function (require) {

    var app = require('durandal/app'),
        notify = require('notify'),
        router = require('plugins/router'),
        dataContext = require('dataContext'),
        eventTracker = require('eventTracker'),
        clientContext = require('clientContext'),
        routes = require('configuration/routes'),
        helpHintRepository = require('repositories/helpHintRepository'),
        localizationManager = require('localization/localizationManager'),
        errorHandlingConfiguration = require('errorHandling/errorHandlingConfiguration'),
        globalErrorHandler = require('errorHandling/globalErrorHandler'),
        feedback = require('viewmodels/feedback'),
        activator = require('durandal/activator');

    var events = {
        navigateToExperiences: "Navigate to experiences",
        navigateToObjectives: 'Navigate to objectives',
        feedback: 'Feedback'
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
        isHintRequestPending = false,

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

        helpHint = ko.observable(undefined),

        helpHintText = ko.computed(function () {
            if (helpHint() == undefined) {
                return '';
            }

            return localizationManager.localize(helpHint().localizationKey);
        }),

        helpHintTitle = ko.computed(function () {
            if (helpHint() == undefined) {
                return '';
            }

            return localizationManager.localize(helpHint().localizationKey + 'Title');
        }),

        hideHelpHint = function () {
            if (helpHint() == undefined || isHintRequestPending) {
                return;
            }

            isHintRequestPending = true;

            helpHintRepository.removeHint(helpHint().id).then(function () {
                helpHint(undefined);
                isHintRequestPending = false;
            });
        },

        showHelpHint = function () {
            if (helpHint() != undefined || isHintRequestPending) {
                return;
            }

            isHintRequestPending = true;
            helpHintRepository.addHint(activeModule()).then(function (hint) {
                helpHint(hint);
                isHintRequestPending = false;
            });
        },

        browserCulture = ko.observable(),

        navigation = ko.observableArray([]),

        showNavigation = function () {
            return _.contains(['404', '400'], this.activeModuleName());
        },

        isTryMode = false,
        userEmail = '',

        activate = function () {
            var that = this;
            return dataContext.initialize()
                .then(function () {
                    errorHandlingConfiguration.configure();
                    globalErrorHandler.subscribeOnAjaxErrorEvents();

                    localizationManager.initialize(window.top.userCultures);
                    
                    router.openUrl = function (url) {
                        window.open(url, '_blank');
                    };

                    router.updateDocumentTitle = function (instance, instruction) {
                        var title = null;

                        if (instruction.config.settings && instruction.config.settings.localizationKey) {
                            title = localizationManager.localize(instruction.config.settings.localizationKey);

                        } else if (instruction.config.title) {
                            title = instruction.config.title;
                        }

                        document.title = title ? app.title + ' | ' + title : app.title;

                        browserCulture(localizationManager.currentLanguage);
                    };

                    router.replace = function (url) {
                        router.navigate(url, { replace: true, trigger: true });
                    };

                    router.reloadLocation = function () {
                        document.location.reload();
                    };

                    router.setLocation = function (url) {
                        document.location = url;
                    };

                    router.navigateWithQueryString = function (url) {
                        var queryString = router.activeInstruction().queryString;
                        router.navigate(_.isNullOrUndefined(queryString) ? url : url + '?' + queryString);
                    };

                    router.download = function (url) {
                        var hash = window.location.hash,
                            href = window.location.href;
                        var downloadUrl = hash == '' ? href + '/' + url : href.replace(hash, url);
                        window.open(downloadUrl);
                    };
                    
                    router.guardRoute = function (routeInfo, params) {
                        if (requestsCounter() > 0) {
                            that.navigation()[1].isPartOfModules(_.contains(objectivesModules, that.activeModuleName()));
                            that.navigation()[0].isPartOfModules(_.contains(experiencesModules, that.activeModuleName()));
                            notify.lockContent();
                            notify.isShownMessage(false);
                            var subscription = requestsCounter.subscribe(function (newValue) {
                                if (newValue == 0) {
                                    notify.unlockContent();
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
                        notify.isShownMessage(true);
                        that.navigation()[0].isPartOfModules(_.contains(experiencesModules, getModuleIdFromRouterActiveInstruction()));
                        that.navigation()[1].isPartOfModules(_.contains(objectivesModules, getModuleIdFromRouterActiveInstruction()));
                    });

                    router.on('router:navigation:composition-complete').then(function () {
                        isViewReady(true);
                        $("[data-autofocus='true']").focus();

                        var $scrollElement = $('.scrollToElement');
                        if ($scrollElement.length != 0) {
                            var targetTop = $scrollElement.offset().top;
                            /*178px header size, 400px header and title and button "Add"*/
                            if (targetTop >= 400) {
                                $('html, body').animate({
                                    scrollTop: targetTop - 178
                                });
                            }
                            $scrollElement.removeClass('scrollToElement');
                        } else {
                            window.scroll(0, 0);
                        }

                        helpHintRepository.getCollection().then(function (helpHints) {
                            var activeHint = _.find(helpHints, function (item) {
                                return item.name === activeModule();
                            });
                            helpHint(activeHint);
                        });
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

                    that.activatorFeedback.activateItem(feedback);

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
        helpHint: helpHint,
        helpHintText: helpHintText,
        hideHelpHint: hideHelpHint,
        showHelpHint: showHelpHint,
        helpHintTitle: helpHintTitle,
        activatorFeedback: activator.create()
    };
}
);