define(['userContext', 'constants', 'notifications/subscriptionExpirationNotification', 'durandal/app'],
    function (userContext, constants, SubscriptionExpirationNotification, app) {
        "use strict";

    var notificationName = 'subscriptionExpirationNotification';

    return {
        execute: execute
    };

    function execute() {
        if (_.isNullOrUndefined(userContext.identity)) {
            return;
        }

        var
            accessType = userContext.identity.subscription.accessType,
            firstname = userContext.identity.firstname,
            currentNotification = null;

        app.trigger('get-notification', notificationName, function(foundNotification) {
            currentNotification = foundNotification;
        });

        if (accessType == constants.accessType.free) {
            app.trigger('remove-notification', currentNotification);
            return;
        }

        var
            expirationDate = userContext.identity.subscription.expirationDate,
            amountOfDays = getAmountOfDayBetweenTwoDays(expirationDate);

        if (_.isNullOrUndefined(expirationDate) || amountOfDays > 7 || amountOfDays < 0) {
            app.trigger('remove-notification', currentNotification);
            return;
        }

        if (!_.isNullOrUndefined(currentNotification) && currentNotification.amountOfDays == amountOfDays) {
            return;
        } else {
            app.trigger('remove-notification', currentNotification);
        }

        var notification = new SubscriptionExpirationNotification(notificationName, firstname, amountOfDays, accessType, expirationDate);
        app.trigger('push-notification', notification);
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