define(['userContext', 'constants', 'notifications/subscriptionExpiration/notification', 'durandal/app'],
    function (userContext, constants, Notification, app) {
        "use strict";

        var controller = {
            execute: execute,
            updateNotification: updateNotification
        };

        return controller;

        function execute() {
            return Q.fcall(function () {
                if (_.isNullOrUndefined(userContext.identity)) {
                    return;
                }

                controller.updateNotification();

                app.on(constants.messages.user.planChanged, controller.updateNotification);
            });
        }

        function updateNotification() {
            var accessType = userContext.identity.subscription.accessType;

            if (accessType == constants.accessType.free) {
                app.trigger(constants.notification.messages.remove, constants.notification.keys.subscriptionExpiration);
                return;
            }

            var expirationDate = userContext.identity.subscription.expirationDate,
                amountOfDays = getAmountOfDayBetweenTwoDays(expirationDate);

            if (!isNotificationNeeded(expirationDate, amountOfDays)) {
                app.trigger(constants.notification.messages.remove, constants.notification.keys.subscriptionExpiration);
                return;
            }

            var notification = new Notification(constants.notification.keys.subscriptionExpiration, userContext.identity.firstname, amountOfDays, accessType, expirationDate);
            app.trigger(constants.notification.messages.push, notification);
        }

        function isNotificationNeeded(expirationDate, amountOfDays) {
            return !_.isNullOrUndefined(expirationDate) && amountOfDays <= 7 && amountOfDays > 0;
        }

        function getAmountOfDayBetweenTwoDays(eventDate) {
            if (_.isNullOrUndefined(eventDate)) {
                return null;
            }
            var diffBetweenDays = eventDate.getTime() - (new Date()).getTime();
            if (diffBetweenDays < 0) {
                return -1;
            }
            return Math.round(diffBetweenDays / (1000 * 60 * 60 * 24));
        }
    });