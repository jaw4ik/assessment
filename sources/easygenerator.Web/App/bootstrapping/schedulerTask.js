define(['scheduler', 'user/subscriptionExpirationNotificationTask'], function (scheduler, subscriptionExpirationNotificationTask) {
    return {
        execute: function () {
            scheduler.push(subscriptionExpirationNotificationTask);
        }
    };
});