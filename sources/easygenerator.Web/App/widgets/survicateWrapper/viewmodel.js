import userContext from 'userContext';
import survicateLoader from 'analytics/survicate/survicateLoader';
import updateStatus from 'analytics/survicate/commands/switchAnsweredStatusCommand'

let helpPopupSelectors = [
    '#hs-beacon',
    '#intercom-frame'
]

let survicateCookies = [
    '__svcid',
    '__svcve',
    '__svid',
    '__svve'
]

class SurvicateWrapper {
    constructor(){
        this.isShown = ko.observable(false);
        this.isLoaded = ko.observable(false);
        this.helpPopupSelectors = helpPopupSelectors;

        _.each(survicateCookies, cookie => {
            delete_cookie(cookie);
        });
    }
    activate() {
        let that = this;

        if (!_.isObject(userContext.identity) || !userContext.identity.canShowSurvicate) {
            return;
        }

        survicateLoader.load(userContext.identity.email);

        var interval = setInterval(function() {
            if (window._sv && _sv.loaded && _sv.seen) {
                _sv.subscribe('closed', () => { that.isShown(false); });

                _sv.subscribe('pointSubmit', () => {
                    if(_sv.survey.currentPoint.constructor.name === 'SurveyCta') {
                        that.isShown(false);
                    }

                    if(userContext.identity.canShowSurvicate) {
                        updateStatus.execute();
                        userContext.identity.canShowSurvicate = false;
                    }
                });

                _sv.subscribe('pointRendered', () => {
                    that.isShown.notifySubscribers(true);
                });
                
                that.isShown(true);
                that.isLoaded(true);

                clearInterval(interval);
            }
        }, 250);        
    }
}

export default new SurvicateWrapper();

function delete_cookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};