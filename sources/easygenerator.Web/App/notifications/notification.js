import app from 'durandal/app';
import constants from 'constants';
import subscriptionExpirationNotificationController from './subscriptionExpiration/notificationController';
import collaborationInviteNotificationController from './collaborationInvite/notificationController';
import organizationInviteNotificationController from './organizationInvite/notificationController';
import organizationInviteConfirmationNotificationController from './organizationInviteConfirmation/notificationController';

let 
    viewModel = {
        collection: ko.observableArray([]),
        activate: activate,
        collapse: collapse,
        toggleIsExpanded: toggleIsExpanded,
        isExpanded: ko.observable(false),
        pushNotification: pushNotification,
        removeNotification: removeNotification,
        activeNotification: ko.observable(),
        moveDirection: null,
        next: next,
        prev: prev
    },
    controllers = [
        subscriptionExpirationNotificationController, 
        collaborationInviteNotificationController, 
        organizationInviteNotificationController,
        organizationInviteConfirmationNotificationController
    ];

viewModel.isVisible = ko.computed(function() {
    return viewModel.collection().length !== 0;
});

viewModel.index = ko.computed(function() {
    return viewModel.collection().indexOf(viewModel.activeNotification());
});

viewModel.canMoveNext = ko.computed(function() {
    return viewModel.index() >= 0 && viewModel.index() < viewModel.collection().length - 1;
});

viewModel.canMovePrev = ko.computed(function() {
    return viewModel.index() > 0;
});

function next() {
    if (!viewModel.canMoveNext())
        return;

    viewModel.moveDirection = 'next';
    viewModel.activeNotification(viewModel.collection()[viewModel.index() + 1]);
}

function prev() {
    if (!viewModel.canMovePrev())
        return;

    viewModel.moveDirection = 'prev';
    viewModel.activeNotification(viewModel.collection()[viewModel.index() - 1]);
}

function toggleIsExpanded() {
    viewModel.isExpanded(!viewModel.isExpanded());
    if (!viewModel.isExpanded()) {
        viewModel.moveDirection = null;
    }
}

function collapse() {
    viewModel.moveDirection = null;
    viewModel.isExpanded(false);
}

function pushNotification(notification) {
    var existingNotification = _.find(viewModel.collection(), function(item) {
        return item.key === notification.key;
    });

    turnNotificationOn(notification);
    if (_.isNullOrUndefined(existingNotification)) {
        viewModel.collection.push(notification);
        if (viewModel.collection().length === 1) {
            viewModel.activeNotification(notification);
        }
    } else {
        viewModel.collection.replace(existingNotification, notification);
        turnNotificationOff(existingNotification);
        if (existingNotification === viewModel.activeNotification()) {
            viewModel.activeNotification(notification);
        }
    }

    if (!viewModel.isExpanded()) {
        viewModel.activeNotification(notification);
        viewModel.isExpanded(true);
    }
}

function removeNotification(notificationKey) {
    var notification = _.find(viewModel.collection(), function(item) {
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
    turnNotificationOff(notification);

    if (viewModel.collection().length === 0) {
        viewModel.activeNotification(null);
        viewModel.isExpanded(false);
        viewModel.moveDirection = null;
    }
}

function turnNotificationOn(notification) {
    if (notification.on) {
        notification.on();
    }
}

function turnNotificationOff(notification) {
    if (notification.off) {
        notification.off();
    }
}

function activate() {
    app.on(constants.notification.messages.remove, removeNotification);
    app.on(constants.notification.messages.push, pushNotification);

    return Promise.all(_.map(controllers, controller => controller.execute()))
        .then(() => {
            if (viewModel.collection().length > 0) {
                viewModel.activeNotification(viewModel.collection()[0]);
            }
        });
}

export default viewModel;