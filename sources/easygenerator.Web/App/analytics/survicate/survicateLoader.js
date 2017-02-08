import constants from 'constants';

var survicateConstants = constants.analytics.survicate;

export default {
    load(identity) {
        window._sv = window._sv || {};
        window._sv.trackingCode = survicateConstants.trackingCode;
        window._sv.identity = identity;

        window.__sv = window.__sv || {};
        window.__sv.intercom = { email: identity };

        return System.import(survicateConstants.apiUrl);
    }
};
