define(['durandal/app', 'plugins/router', 'eventManager', 'context', 'xApi/configuration/constants', 'xApi/activityManager', 'xApi/errorsHandler'],
    function (app, router, eventManager, context, constants, activityManager, errorsHandler) {

        "use strict";

        var
            usermail = (function () {
                var value = ko.observable('');
                value.isValid = ko.computed(function () {
                    return !!value() && constants.patterns.email.test(value().trim());
                });
                value.isModified = ko.observable(false);
                value.markAsModified = function () {
                    value.isModified(true);
                };
                return value;
            })(),
            username = (function () {
                var value = ko.observable('');
                value.isValid = ko.computed(function () {
                    return !!value() && !!value().trim();
                });
                value.isModified = ko.observable(false);
                value.markAsModified = function () {
                    value.isModified(true);
                };
                return value;
            })(),

            skip = function () {
                activityManager.turnOff();
                startCourse();
            },

            login = function () {
                if (usermail.isValid() && username.isValid()) {
                    var title = context.experience.title;
                    var url = window.top.location.toString() + '?experience_id=' + context.experience.id;
                    var actor = activityManager.createActor(username(), usermail());
                    activityManager.init(actor, title, url).then(function () {
                        startCourse();
                    }).fail(function (reason) {
                        activityManager.turnOff();
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