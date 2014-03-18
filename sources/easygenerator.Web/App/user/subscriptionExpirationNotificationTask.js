define(['userContext', 'constants', 'notifications/templates/expirationNotification', 'viewmodels/shell'], function (userContext, constants, ExpirationNotification, shellViewModel) {

    var notificationName = 'expirationNotification';

    return {
        execute: execute
    };

    function execute() {
        if (_.isNullOrUndefined(userContext.identity)) {
            return;
        }

        var
            expirationDate = userContext.identity.expirationDate,
            firstname = userContext.identity.firstname,
            accessType = userContext.identity.accessType
        ;

        if (accessType == constants.accessType.free) {
            return;
        }

        if (_.isNullOrUndefined(expirationDate) || expirationDate > 7) {
            return;
        }

        var notification = new ExpirationNotification(notificationName, firstname, expirationDate),
            currentNotification = _.find(shellViewModel.notifications(), function (item) {
                return item.name = notificationName;
            });

        if (!_.isNullOrUndefined(currentNotification) && currentNotification.expirationDate == expirationDate) {
            return;
        } else if (!_.isNullOrUndefined(currentNotification)) {
            shellViewModel.notifications.remove(currentNotification);
        }

        shellViewModel.notifications.push(notification);
    }

})