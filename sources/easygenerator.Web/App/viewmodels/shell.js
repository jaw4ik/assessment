define(['durandal/app', 'plugins/router', 'configuration/routes', 'dataContext', 'localization/localizationManager', 'eventTracker', 'httpWrapper', 'notify', 'clientContext'],
    function (app, router, routes, datacontext, localizationManager, eventTracker, httpWrapper, notify, clientContext) {
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
            objectivesModules = ['objectives', 'objective'],
            experiencesModules = ['experiences', 'experience'],
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

            isTryMode = false,
            userEmail = '',

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
                                notify.isShownMessage(false);
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
                            notify.isShownMessage(true);
                        });

                        router.on('router:navigation:composition-complete').then(function () {
                            isViewReady(true);
                            $("[data-autofocus='true']").focus();
                            
                            var $scrollElement = $('.scrollToElement');
                            if ($scrollElement.length != 0) {
                                var targetTop = $scrollElement.offset().top;
                                $('html, body').animate({
                                    scrollTop: targetTop - 140 //header size
                                });
                                $scrollElement.removeClass('scrollToElement');
                            } else {
                                window.scroll(0, 0);
                            }
                        });

                        that.navigation([
                            {
                                navigate: function () {
                                    sendEvent(events.navigateToExperiences);
                                    ClearClientContext();
                                    router.navigate('experiences');
                                },
                                title: 'experiences',
                                isActive: ko.computed(function () {
                                    return _.contains(experiencesModules, that.activeModuleName()) || router.isNavigating();
                                })
                            },
                            {
                                navigate: function () {
                                    sendEvent(events.navigateToObjectives);
                                    ClearClientContext();
                                    router.navigate('objectives');
                                },
                                title: 'materialDevelopment',
                                isActive: ko.computed(function () {
                                    return _.contains(objectivesModules, that.activeModuleName()) || router.isNavigating();
                                })
                            }
                        ]);
                        that.isTryMode = datacontext.isTryMode;
                        that.userEmail = datacontext.userEmail;

                        ClearClientContext();

                        function ClearClientContext() {
                            clientContext.set('lastVisitedObjective', null);
                            clientContext.set('lastVistedExperience', null);
                        }

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
            
            userEmail: userEmail
        };
    }
);