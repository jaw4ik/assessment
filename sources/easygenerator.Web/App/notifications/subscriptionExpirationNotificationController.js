﻿define(['userContext', 'constants', 'notifications/subscriptionExpirationNotification', 'viewmodels/shell'], function (userContext, constants, SubscriptionExpirationNotification, shellViewModel) {

    var notificationName = 'subscriptionExpirationNotification';

    return {
        execute: execute
    };

    function execute() {
        setTimeout(execute, 2000);

        if (_.isNullOrUndefined(userContext.identity)) {
            return;
        }
        
        var 
            accessType = userContext.identity.subscription.accessType,
            firstname = userContext.identity.firstname,
            currentNotification = _.find(shellViewModel.notifications(), function(item) {
                return item.name = notificationName;
            });

        if (accessType == constants.accessType.free) {
            removeNotificationIfExists(currentNotification);
            return;
        }

        var expirationDate = moment(userContext.identity.subscription.expirationDate),
            amountOfDays = expirationDate.diff(moment(), 'days');

        if (_.isNullOrUndefined(userContext.identity.subscription.expirationDate) || !expirationDate.isValid() || amountOfDays > 7 || amountOfDays < 0) {
            removeNotificationIfExists(currentNotification);
            return;
        }

        if (!_.isNullOrUndefined(currentNotification) && currentNotification.amountOfDays == amountOfDays) {
            return;
        } else {
            removeNotificationIfExists(currentNotification);
        }

        var notification = new SubscriptionExpirationNotification(notificationName, firstname, amountOfDays);
        shellViewModel.notifications.push(notification);
    }

    function removeNotificationIfExists(notification) {
        if (!_.isNullOrUndefined(notification)) {
            shellViewModel.notifications.remove(notification);
        }
        return;
    }

});