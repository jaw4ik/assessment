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
            activeNotification: ko.observable(),
            isMovingForward: false,
            next: next,
            prev: prev
        },
            controllers = [subscriptionExpirationNotificationController, collaborationInviteNotificationController];

        viewModel.isVisible = ko.computed(function () {
            return viewModel.collection().length != 0;
        });

        viewModel.index = ko.computed(function () {
            return viewModel.collection().indexOf(viewModel.activeNotification());
        });

        viewModel.canMoveNext = ko.computed(function () {
            return viewModel.index() >= 0 && viewModel.index() < viewModel.collection().length - 1;
        });

        viewModel.canMovePrev = ko.computed(function () {
            return viewModel.index() > 0;
        });

        return viewModel;

        function next() {
            if (!viewModel.canMoveNext())
                return;

            viewModel.isMovingForward = true;
            viewModel.activeNotification(viewModel.collection()[viewModel.index() + 1]);
        }

        function prev() {
            if (!viewModel.canMovePrev())
                return;

            viewModel.isMovingForward = false;
            viewModel.activeNotification(viewModel.collection()[viewModel.index() - 1]);
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
                if (viewModel.collection().length === 1) {
                    viewModel.activeNotification(notification);
                }
            } else {
                viewModel.collection.replace(existingNotification, notification);
                if (existingNotification === viewModel.activeNotification()) {
                    viewModel.activeNotification(notification);
                }
            }
        }

        function removeNotification(notificationKey) {
            var notification = _.find(viewModel.collection(), function (item) {
                return item.key === notificationKey;
            });

            if (_.isNullOrUndefined(notification))
                return;

            if (viewModel.activeNotification() === notification) {
                var isLastElement = viewModel.collection().indexOf(notification) === viewModel.collection().length - 1;
                if (isLastElement) {
                    prev();
                } else {
                    next();
                }
            }

            viewModel.collection.remove(notification);
            if (viewModel.collection().length == 0) {
                viewModel.activeNotification(null);
                viewModel.isExpanded(false);
            }
        }

        function activate() {
            app.on(constants.notification.messages.remove, removeNotification);
            app.on(constants.notification.messages.push, pushNotification);

            return Q.all(_.map(controllers, function (controller) {
                return controller.execute();
            }))
                .then(function () {
                    if (viewModel.collection().length > 0) {
                        viewModel.activeNotification(viewModel.collection()[0]);
                    }
                });
        }
    });