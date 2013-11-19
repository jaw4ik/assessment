define(['durandal/app', 'plugins/router', 'eventManager', 'context', '../configuration/viewConstants', '../errorsHandler', 'xApi/xApiInitializer'],
    function (app, router, eventManager, context, viewConstants, errorsHandler, xApiInitializer) {

        "use strict";

        var
            usermail = (function () {
                var value = ko.observable('');
                value.trim = function () {
                    value(ko.utils.unwrapObservable(value).trim());
                };
                value.isValid = ko.computed(function () {
                    return !!value() && viewConstants.patterns.email.test(value().trim());
                });
                value.isModified = ko.observable(false);
                value.markAsModified = function () {
                    value.isModified(true);
                    return value;
                };
                return value;
            })(),
            username = (function () {
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
            })(),

            skip = function () {
                xApiInitializer.turnOff();
                startCourse();
            },

            login = function () {
                if (usermail.isValid() && username.isValid()) {
                    var title = context.title;
                    var url = window.top.location.toString() + '?experience_id=' + context.experienceId;
                    var actor = xApiInitializer.createActor(username(), usermail());
                    xApiInitializer.init(actor, title, url).then(function () {
                        startCourse();
                    }).fail(function (reason) {
                        xApiInitializer.turnOff();
                        errorsHandler.handleError(reason);
                    });
                }
                else {
                    usermail.markAsModified();
                    username.markAsModified();
                }
            },

            startCourse = function () {
                app.trigger(eventManager.events.courseStarted);
                router.navigate('home');
            },

            activate = function () {
            };

        return {
            activate: activate,

            usermail: usermail,
            username: username,

            skip: skip,
            login: login
        };

    });