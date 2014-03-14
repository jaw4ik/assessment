define(['plugins/router', 'eventManager', 'context', '../configuration/viewConstants', '../errorsHandler', 'xApi/xApiInitializer'],
    function(router, eventManager, context, viewConstants, errorsHandler, xApiInitializer) {

        "use strict";

        var viewModel = {
            activate: activate,
            courseTitle: "\"" + context.course.title + "\"",
            
            usermail: usermail(),
            username: username(),

            skip: skip,
            login: login
        };

        return viewModel;

        function usermail() {
            var value = ko.observable('');
            value.trim = function() {
                value(ko.utils.unwrapObservable(value).trim());
            };
            value.isValid = ko.computed(function() {
                return !!value() && viewConstants.patterns.email.test(value().trim());
            });
            value.isModified = ko.observable(false);
            value.markAsModified = function() {
                value.isModified(true);
                return value;
            };
            return value;
        }

        function username () {
                var value = ko.observable('');
                value.trim = function () {
                    value(ko.utils.unwrapObservable(value).trim());
                };
                value.isValid = ko.computed(function () {
                    return !!value() && !!value().trim();
                });
                value.isModified = ko.observable(false);
                value.markAsModified = function () {
                    value.isModified(true);
                    return value;
                };
                return value;
        };

        function skip () {
            xApiInitializer.turnOff();
            startCourse();
        };

        function login () {
            if (viewModel.usermail.isValid() && viewModel.username.isValid()) {
                var title = context.course.title;

                var pageUrl = "";
                if (window != window.top && ('referrer' in document)) {
                    pageUrl = document.referrer;
                } else {
                    pageUrl = window.location.toString();
                }

                var url = pageUrl + '?course_id=' + context.course.id;
                var actor = xApiInitializer.createActor(viewModel.username, viewModel.usermail);
                xApiInitializer.init(actor, title, url).then(function () {
                    startCourse();
                }).fail(function (reason) {
                    xApiInitializer.turnOff();
                    errorsHandler.handleError(reason);
                });
            }
            else {
                viewModel.usermail.markAsModified();
                viewModel.username.markAsModified();
            }
        };
        
        function startCourse () {
            eventManager.courseStarted();
            router.navigate('');
        };

        function activate () {};
    });