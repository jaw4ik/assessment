define(['durandal/app', 'notifications/subscriptionExpiration/notificationController', 'constants'], function (app, subscriptionExpirationNotificationController, constants) {
    "use strict";

    var viewModel = {
        collection: ko.observableArray([]),
        activate: activate,
        collapse: collapse,
        toggleIsExpanded: toggleIsExpanded,
        isExpanded: ko.observable(false),
        pushNotification: pushNotification,
        removeNotification: removeNotification
    },
        controllers = [subscriptionExpirationNotificationController];

    viewModel.isVisible = ko.computed(function () {
        return viewModel.collection().length != 0;
    });

    return viewModel;

    function toggleIsExpanded() {
        viewModel.isExpanded(!viewModel.isExpanded());
    }

    function collapse() {
        viewModel.isExpanded(false);
    }

    function pushNotification(notification) {
        var existingNotification = _.find(viewModel.collection(), function (item) {
            return item.key = notification.key;
        });

        if (_.isNullOrUndefined(existingNotification)) {
            viewModel.collection.push(notification);
        } else {
            viewModel.collection.replace(existingNotification, notification);
        }
    }

    function removeNotification(notificationKey) {
        var notification = _.find(viewModel.collection(), function (item) {
            return item.key = notificationKey;
        });

        if (!_.isNullOrUndefined(notification)) {
            viewModel.collection.remove(notification);
        }
    }

    function activate() {
        app.on(constants.notification.messages.remove, removeNotification);
        app.on(constants.notification.messages.push, pushNotification);

        return Q.all(_.map(controllers, function (controller) {
            return controller.execute();
        }));
    }
});