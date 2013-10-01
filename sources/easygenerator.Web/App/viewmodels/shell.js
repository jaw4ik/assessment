define(['durandal/app', 'plugins/router', 'configuration/routes', 'dataContext', 'localization/localizationManager', 'eventTracker', 'httpWrapper', 'notify'],
    function (app, router, routes, datacontext, localizationManager, eventTracker, httpWrapper, notify) {
        var
            events = {
                navigateToExperiences: "Navigate to experiences",
                navigateToObjectives: 'Navigate to objectives'
            },
            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var requestsCounter = ko.observable(0);
        
        app.on('httpWrapper:post-begin').then(function () {
            requestsCounter(requestsCounter() + 1);
        });
        
        app.on('httpWrapper:post-end').then(function () {
            requestsCounter(requestsCounter() - 1);
        });

        var experiencesModule = 'experiences',
            objectivesModule = 'objectives',
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

            browserCulture = ko.observable(),

            navigation = ko.observableArray([]),

            showNavigation = function () {
                return _.contains(['404', '400'], this.activeModuleName());
            },

            activate = function () {
                var that = this;
                return datacontext.initialize()
                    .then(function () {

                        localizationManager.initialize(window.top.userCultures);

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

                        router.navigateWithQueryString = function (url) {
                            var queryString = router.activeInstruction().queryString;
                            router.navigate(_.isNullOrUndefined(queryString) ? url : url + '?' + queryString);
                        };

                        router.download = function (url) {
                            var hash = window.location.hash,
                                href = window.location.href;
                            var downloadUrl = hash == '' ? href + '/' + url : href.replace(hash, url);
                            window.location.assign(downloadUrl);
                        };

                        router.guardRoute = function (routeInfo, params) {
                            if (requestsCounter() > 0) {
                                notify.lockContent();
                                var subscription = requestsCounter.subscribe(function (newValue) {
                                    if (newValue == 0) {
                                        notify.unlockContent();
                                        router.navigate(params.fragment);
                                        subscription.dispose();
                                    }
                                });
                                return false;
                            }
                            return true;
                        };

                        router.on('router:route:activating').then(function () {
                            isViewReady(false);
                        });

                        router.on('router:navigation:composition-complete').then(function () {
                            isViewReady(true);
                            $("[data-autofocus='true']").focus();
                        });

                        that.navigation([
                            {
                                navigate: function () {
                                    sendEvent(events.navigateToExperiences);
                                    router.navigate('experiences');
                                },
                                title: 'experiences',
                                isActive: ko.computed(function () {
                                    return that.activeModuleName() == experiencesModule || router.isNavigating();
                                })
                            },
                            {
                                navigate: function () {
                                    sendEvent(events.navigateToObjectives);
                                    router.navigate('objectives');
                                },
                                title: 'materialDevelopment',
                                isActive: ko.computed(function () {
                                    return that.activeModuleName() == objectivesModule || router.isNavigating();
                                })
                            }
                        ]);

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
            navigation: navigation
        };
    }
);