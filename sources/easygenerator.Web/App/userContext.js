﻿define(['durandal/app', 'constants', 'models/user', 'http/authHttpWrapper', 'http/storageHttpWrapper'], function (app, constants, User, authHttpWrapper, storageHttpWrapper) {

    var userContext = {
        identity: null,
        hasStarterAccess: hasStarterAccess,
        hasPlusAccess: hasPlusAccess,
        identify: identify,
        identifyStoragePermissions: identifyStoragePermissions
    };

    return userContext;

    function identify() {
        return Q(authHttpWrapper.post('auth/identity').then(function (user) {
            userContext.identity = _.isString(user.email) ? new User(user) : null;
            app.trigger(constants.messages.user.identified, userContext.identity);
        }));
    }

    function identifyStoragePermissions() {
        return storageHttpWrapper.get(constants.messages.storage.host + constants.messages.storage.userUrl).then(function (data) {
            userContext.identity.availableStorageSpace = data.AvailableStorageSpace;
            userContext.identity.totalStorageSpace = data.TotalStorageSpace;
        });
    }

    function hasStarterAccess() {
        return hasAccess(constants.accessType.starter);
    }

    function hasPlusAccess() {
        return hasAccess(constants.accessType.plus);
    }

    function hasAccess(accessType) {
        if (accessType === constants.accessType.free) {
            return true;
        }

        var identity = userContext.identity;
        if (_.isNullOrUndefined(identity) || _.isNullOrUndefined(identity.subscription)) {
            return false;
        }

        var subscription = identity.subscription;
        return subscription.accessType >= accessType && subscription.expirationDate >= new Date();
    }
})