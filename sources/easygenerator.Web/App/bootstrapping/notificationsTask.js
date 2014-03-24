define(['notifications/subscriptionExpirationNotificationController'], function (subscriptionExpirationNotificationController) {
    return {
        execute: function () {
           subscriptionExpirationNotificationController.execute();
        }
    };
});