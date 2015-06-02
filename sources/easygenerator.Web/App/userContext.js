define(['durandal/app', 'constants', 'notify', 'localization/localizationManager', 'models/user', 'http/authHttpWrapper', 'http/storageHttpWrapper'], function (app, constants, notify, localizationManager, User, authHttpWrapper, storageHttpWrapper) {

    var userContext = {
        identity: null,
        hasStarterAccess: hasStarterAccess,
        hasPlusAccess: hasPlusAccess,
        hasTrialAccess: hasTrialAccess,
        identify: identify,
        storageIdentity: null,
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
        return Q(storageHttpWrapper.get(constants.storage.host + constants.storage.userUrl).then(function (data) {
            userContext.storageIdentity = { availableStorageSpace: data.AvailableStorageSpace, totalStorageSpace: data.TotalStorageSpace }
        }).fail(function () {
            userContext.storageIdentity = { availableStorageSpace: 0, totalStorageSpace: 0 }
            notify.error(localizationManager.localize('storageFailed'));
        }));
    }

    function hasStarterAccess() {
        return hasAccess(constants.accessType.starter);
    }

    function hasPlusAccess() {
        return hasAccess(constants.accessType.plus);
    }

    function hasTrialAccess() {
        return hasAccess(constants.accessType.trial);
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