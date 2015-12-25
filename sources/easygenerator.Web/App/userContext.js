import app from 'durandal/app';
import _ from 'underscore';
import constants from 'constants';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import User from 'models/user';
import authHttpWrapper from 'http/authHttpWrapper';
import storageHttpWrapper from 'http/storageHttpWrapper';

class UserContext {
    constructor () {
        this.identity = null;
        this.storageIdentity = null;
    }

    async identify() {
        let user = await authHttpWrapper.post('auth/identity');

        this.identity = _.isString(user.email) ? new User(user) : null;
        app.trigger(constants.messages.user.identified, this.identity);
    }

    async identifyStoragePermissions() {
        try {
            let data = await storageHttpWrapper.get(constants.storage.host + constants.storage.userUrl);
            this.storageIdentity = { availableStorageSpace: data.AvailableStorageSpace, totalStorageSpace: data.TotalStorageSpace };
        } catch (e) {
            this.storageIdentity = { availableStorageSpace: 0, totalStorageSpace: 0 };
            notify.error(localizationManager.localize('storageFailed'));
        }
    }

    hasStarterAccess() {
        return this.hasAccess(constants.accessType.starter);
    }

    hasPlusAccess() {
        return this.hasAccess(constants.accessType.plus);
    }

    hasAcademyAccess() {
        return this.hasAccess(constants.accessType.academy);
    }

    hasTrialAccess() {
        return this.hasAccess(constants.accessType.trial);
    }

    hasFreeAccess() {
        var identity = this.identity;
        if (_.isNullOrUndefined(identity) || _.isNullOrUndefined(identity.subscription)) {
            return true;
        }

        var subscription = identity.subscription;
        return subscription.accessType === constants.accessType.free || subscription.expirationDate < new Date();
    }

    hasAccess(accessType) {
        if (accessType === constants.accessType.free) {
            return true;
        }

        var identity = this.identity;
        if (_.isNullOrUndefined(identity) || _.isNullOrUndefined(identity.subscription)) {
            return false;
        }

        var subscription = identity.subscription;
        return subscription.accessType >= accessType && subscription.expirationDate >= new Date();
    }
}

export default new UserContext();