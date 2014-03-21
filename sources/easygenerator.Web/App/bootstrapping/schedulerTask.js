define(['scheduler', 'notifications/subscriptionExpirationNotificationTask'], function (scheduler, subscriptionExpirationNotificationTask) {
    return {
        execute: function () {
            scheduler.push(subscriptionExpirationNotificationTask);
        }
    };
});