import constants from 'constants';

var survicateConstants = constants.analytics.survicate;

export default {
    load(identity) {
        window._sv = window._sv || {};
        window._sv.trackingCode = survicateConstants.trackingCode;
        window._sv.identity = identity;

        return System.import(survicateConstants.apiUrl);
    }
};
