define(['plugins/router', 'eventTracker', 'dataContext', 'httpWrapper', 'uiLocker', 'userContext'],
    function (router, eventTracker, dataContext, httpWrapper, uiLocker, userContext) {

        var
            events = {
                startEasygeneratorIfDoNotShowAgainChecked: 'Start easygenerator from welcome page and do not show it again',
                startEasygeneratorIfDoNotShowAgainUnchecked: 'Start easygenerator from welcome page and show it again',
                startEasygeneratorForAnonymousUser: 'Start easygenerator from welcome page'
            },

            isShowCheckbox = ko.observable(false),

            isCheckedDoNotShowAgain = ko.observable(false),

            startEasygenerator = function () {
                if (_.isObject(userContext.identity)) {
                    uiLocker.lock();
                    var isChecked = !this.isCheckedDoNotShowAgain();
                    return httpWrapper.post('api/user/setisshowintroductionpage', { isshowintroduction: isChecked }).then(function () {
                        eventTracker.publish(!isChecked ? events.startEasygeneratorIfDoNotShowAgainChecked : events.startEasygeneratorIfDoNotShowAgainUnchecked);
                        dataContext.userSettings.isShowIntroduction = isChecked;
                        uiLocker.unlock();
                        router.replace('');
                    }).fail(function() {
                        uiLocker.unlock();
                    });
                }
                eventTracker.publish(events.startEasygeneratorForAnonymousUser);
                router.replace('');
            },
        
            changeDoNotShowAgain = function() {
                this.isCheckedDoNotShowAgain(!this.isCheckedDoNotShowAgain());
            },

            activate = function () {
                if (_.isObject(userContext.identity)) {
                    this.isShowCheckbox(true);
                    this.isCheckedDoNotShowAgain(!dataContext.userSettings.isShowIntroduction);
                }
            };

        return {
            isShowCheckbox: isShowCheckbox,
            isCheckedDoNotShowAgain: isCheckedDoNotShowAgain,
            changeDoNotShowAgain: changeDoNotShowAgain,
            startEasygenerator: startEasygenerator,
            activate: activate
        };
    }
);