define(['userContext', 'constants', 'durandal/app', 'eventTracker', 'plugins/router'],
    function (userContext, constants, app, eventTracker, router) {
        "use strict";

        var viewModel = {
            username: null,
            useremail: null,
            avatarLetter: null,

            isFreeUser: ko.observable(false),
            userPlanChanged: userPlanChanged,
            openUpgradePlanUrl: openUpgradePlanUrl,

            signOut: signOut,
            newEditor: ko.observable(false),
            coggnoSPUrl: constants.coggno.serviceProviderUrl,
            switchEditor: function () { },

            activate: activate
        };

        return viewModel;

        function activate(data) {
            viewModel.isFreeUser(userContext.hasFreeAccess() || userContext.hasTrialAccess());
            app.on(constants.messages.user.planChanged, userPlanChanged);

            if (_.isObject(userContext.identity)) {
                viewModel.username = _.isEmptyOrWhitespace(userContext.identity.fullname)
                    ? userContext.identity.email
                    : userContext.identity.fullname;

                viewModel.avatarLetter = viewModel.username.charAt(0);
                viewModel.useremail = userContext.identity.email;
            }

            if (data) {
                viewModel.newEditor(data.newEditor);
                if (_.isFunction(data.switchEditor)) {
                    viewModel.switchEditor = data.switchEditor;
                }
            }
        }

        function userPlanChanged() {
            viewModel.isFreeUser(userContext.hasFreeAccess() || userContext.hasTrialAccess());
        }

        function openUpgradePlanUrl() {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.userMenuInHeader);
            router.openUrl(constants.upgradeUrl);
        }

        function signOut() {
            window.auth.logout();
            router.setLocation(constants.signinUrl);
        }
    }
);