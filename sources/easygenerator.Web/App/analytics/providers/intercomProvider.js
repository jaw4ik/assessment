import _ from 'underscore';
import userContext from 'userContext';
import constants from 'constants';

let supportedEvents = {
    upgradeNow: constants.upgradeEvent,
    downloadScorm: 'Download SCORM 1.2 course'
};

let intercomEvents = {
    upgradeNowClicked: '\'Upgrade now\' clicked',
    scormDownloaded: 'SCORM 1.2 downloaded'
};

class IntercomWrapper {
    constructor() {
        this.intercom = window.Intercom;
    }
    boot(email, name, role, phone, plan, profile) {
        if (!this.intercom) {
            return;
        }

        let appId = window.analytics.intercomapp_id;

        this.intercom('boot', { app_id: appId, email: email, name: name, role: role, phone: phone, plan: plan, profile: profile });
    }
    trackEvent(event) {
        if (!this.intercom || !event) {
            return;
        }

        this.intercom('trackEvent', event.name, event.metadata);
    }
    update() {
        if (!this.intercom) {
            return;
        }

        this.intercom('update');
    }
}

export default class IntercomProvider {
    constructor() {
        this.intercomWrapper = new IntercomWrapper();
    }
    identify() {
        if (!_.isObject(userContext.identity)) {
            return;
        }

        let email = userContext.identity.email;
        let name = `${userContext.identity.firstname} ${userContext.identity.lastname}`;
        let phone = userContext.identity.phone;
        let role = userContext.identity.role;
        let accessType = _.isObject(userContext.identity.subscription) ? userContext.identity.subscription.accessType : '';
        let plan = getPlanName(accessType);
        let profileLink = `http://${window.location.host}/dashboard/users?email=${encodeURIComponent(email)}`;

        this.intercomWrapper.boot(email, name, phone, role, plan, profileLink);
    }
    trackEvent(eventName, category) {
        let intercomEvent = null;

        switch (eventName) {
            case supportedEvents.upgradeNow:
                intercomEvent = { name: intercomEvents.upgradeNowClicked, metadata: { category: category || '' } }
                break;
            case supportedEvents.downloadScorm:
                intercomEvent = { name: intercomEvents.scormDownloaded };
                break;
        }

        this.intercomWrapper.trackEvent(intercomEvent);
        this.intercomWrapper.update();
    }
}

function getPlanName(accessType) {
    let planName = '';
    switch (accessType) {
        case constants.accessType.free :
            planName = 'Free';
            break;
        case constants.accessType.starter:
            planName = 'Starter';
            break;
        case constants.accessType.plus:
            planName = 'Plus';
            break;
        case constants.accessType.academy:
            planName = 'Academy';
            break;
        case constants.accessType.academyBT:
            planName = 'AcademyBT';
            break;
        case constants.accessType.trial:
            planName = 'Trial';
            break;
    }

    return planName;
}