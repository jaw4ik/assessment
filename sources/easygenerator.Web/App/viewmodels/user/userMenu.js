﻿define(['userContext', 'constants', 'durandal/app', 'eventTracker', 'plugins/router'],
    function (userContext, constants, app, eventTracker, router) {
        "use strict";

        var viewModel = {
            username: null,
            hasStarterAccess: ko.observable(false),
            userPlanChanged: userPlanChanged,
            activate: activate,
            avatarLetter: null,
            openUpgradePlanUrl: openUpgradePlanUrl,
            signOut: signOut
        };

        return viewModel;

        function activate() {
            viewModel.hasStarterAccess(userContext.hasStarterAccess());
            app.on(constants.messages.user.planChanged, userPlanChanged);

            if (_.isObject(userContext.identity)) {
                viewModel.username = _.isEmptyOrWhitespace(userContext.identity.fullname)
                    ? userContext.identity.email
                    : userContext.identity.fullname;

                viewModel.avatarLetter = viewModel.username.charAt(0);
            }
        }

        function userPlanChanged() {
            viewModel.hasStarterAccess(userContext.hasStarterAccess());
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