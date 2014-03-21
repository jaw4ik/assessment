define(['userContext', 'constants', 'notifications/subscriptionExpirationNotification', 'viewmodels/shell'], function (userContext, constants, SubscriptionExpirationNotification, shellViewModel) {

    var notificationName = 'subscriptionExpirationNotification';

    return {
        execute: execute
    };

    function execute() {
        if (_.isNullOrUndefined(userContext.identity)) {
            return;
        }

        var
            amountOfDays = moment(userContext.identity.expirationDate).diff(moment(), 'days'),
            firstname = userContext.identity.firstname,
            accessType = userContext.identity.accessType,
            currentNotification = _.find(shellViewModel.notifications(), function (item) {
                return item.name = notificationName;
            });

        if (accessType == constants.accessType.free) {
            removeNotificationIfExists(currentNotification);
            return;
        }

        if (_.isNullOrUndefined(userContext.identity.expirationDate) || amountOfDays > 7 || amountOfDays < 0) {
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