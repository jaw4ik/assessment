import app from 'durandal/app';
import _ from 'underscore';
import constants from 'constants';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import User from 'models/user';
import authHttpWrapper from 'http/authHttpWrapper';
import storageHttpWrapper from 'http/storageHttpWrapper';
import binder from 'binder';

class UserContext {
    constructor () {
        binder.bindClass(this);
        this.identity = null;
        this.storageIdentity = null;
        this.ltiData = {};
        this.samlData = {};
    }

    async identify() {
        let user = await authHttpWrapper.post('auth/identity');
        if (_.isNullOrUndefined(user)) {
            await window.auth.logout();
            window.location.replace('/#');
            return;
        }

        this.identity = _.isString(user.email) ? new User(user) : null;
        if (this.ltiData.companyId && this.identity) {
            let currentCompany = _.find(this.identity.companies, company => company.id === this.ltiData.companyId);
            if (currentCompany && currentCompany.hideDefaultPublishOptions) {
                this.identity.companies = [currentCompany];
            } else if (currentCompany) {
                currentCompany.priority = 10000;
            }
        } else if (this.identity) {
            this.identity.companies.forEach(function(company) {
                company.hideDefaultPublishOptions = false;
            });
        }
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

    async identifyExternalUser(endpoint, tokenName, token, callback) {
        if (!token) {
            return false;
        }
        var response = await authHttpWrapper.post(endpoint, { token });
        if (!response) {
            return true;
        }
        if (response.unauthorized) {
            throw {
                logout: true,
                [tokenName]: token
            };
        }
        if (_.isFunction(callback)) {
            callback(response);
        }
        return true;
    }

    identifyLtiUser() {
        return this.identifyExternalUser('auth/identifyLtiUser', 'ltiUserInfoToken', this.ltiData.ltiUserInfoToken, response => {
            if (response.companyId) {
                this.ltiData.companyId = response.companyId;
            }
        });
    }

    identifySamlUser() {
        return this.identifyExternalUser('auth/identifySamlUser', 'samlIdPUserInfoToken', this.samlData.samlIdPUserInfoToken);
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