define(['durandal/app', 'notifications/subscriptionExpiration/notificationController', 'notifications/collaborationInvite/notificationController', 'constants'],
    function (app, subscriptionExpirationNotificationController, collaborationInviteNotificationController, constants) {
        "use strict";

        var viewModel = {
            collection: ko.observableArray([]),
            activate: activate,
            collapse: collapse,
            toggleIsExpanded: toggleIsExpanded,
            isExpanded: ko.observable(false),
            pushNotification: pushNotification,
            removeNotification: removeNotification,
            index: ko.observable(0),
            next: next,
            prev: prev
        },
            controllers = [subscriptionExpirationNotificationController, collaborationInviteNotificationController];

        viewModel.isVisible = ko.computed(function () {
            return viewModel.collection().length != 0;
        });

        viewModel.canMoveNext = ko.computed(function () {
            return viewModel.index() < viewModel.collection().length - 1;
        });

        viewModel.canMovePrev = ko.computed(function () {
            return viewModel.index() > 0;
        });

        return viewModel;

        function next() {
            viewModel.index(viewModel.index() + 1);
        }

        function prev() {
            viewModel.index(viewModel.index() - 1);
        }

        function toggleIsExpanded() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function collapse() {
            viewModel.isExpanded(false);
        }

        function pushNotification(notification) {
            var existingNotification = _.find(viewModel.collection(), function (item) {
                return item.key === notification.key;
            });

            if (_.isNullOrUndefined(existingNotification)) {
                viewModel.collection.push(notification);
            } else {
                viewModel.collection.replace(existingNotification, notification);
            }
        }

        function removeNotification(notificationKey) {
            var notification = _.find(viewModel.collection(), function (item) {
                return item.key === notificationKey;
            });

            if (!_.isNullOrUndefined(notification)) {
                var isLastElement = viewModel.collection().indexOf(notification) === viewModel.collection().length - 1;
                if (isLastElement) {
                    prev();
                }

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