define(['userContext', 'constants', 'durandal/app', 'eventTracker', 'plugins/router'],
    function (userContext, constants, app, eventTracker, router) {
        "use strict";

        var viewModel = {
            username: null,
            useremail: null,
            hasPlusAccess: ko.observable(false),
            newEditor: ko.observable(false),
            userPlanChanged: userPlanChanged,
            activate: activate,
            avatarLetter: null,
            openUpgradePlanUrl: openUpgradePlanUrl,
            signOut: signOut,
            switchEditor: function() {}
        };

        return viewModel;

        function activate(data) {
            viewModel.hasPlusAccess(userContext.hasPlusAccess());
            app.on(constants.messages.user.downgraded, userPlanChanged);
            app.on(constants.messages.user.upgradedToStarter, userPlanChanged);
            app.on(constants.messages.user.upgradedToPlus, userPlanChanged);

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
            viewModel.hasPlusAccess(userContext.hasPlusAccess());
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