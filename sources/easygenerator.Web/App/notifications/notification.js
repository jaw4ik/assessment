define(['durandal/app', 'notifications/subscriptionExpirationNotificationController'], function (app, subscriptionExpirationNotificationController) {
    "use strict";

    app.on('remove-notification', function (notification) {
        if (!_.isNullOrUndefined(notification)) {
            viewmodel.collection.remove(notification);
        }
    });

    app.on('push-notification', function (notification) {
        viewmodel.collection.push(notification);
    });

    app.on('get-notification', function(notificationName, callback) {
        var notification = _.find(viewmodel.collection(), function (item) {
            return item.name = notificationName;
        });
        callback(notification);
    });

    var viewmodel = {
        collection: ko.observableArray([]),
        isVisible: ko.observable(true),
        activate: activate
    };

    viewmodel.isVisible = ko.computed(function() {
        return viewmodel.collection().length != 0;
    });

    return viewmodel;

    function activate() {
        return Q.fcall(function () {
            runController();
        });
    }

    function runController() {
        subscriptionExpirationNotificationController.execute();
        setTimeout(runController, 2000);
    }

});