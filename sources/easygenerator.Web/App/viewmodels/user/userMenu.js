﻿define(['userContext', 'constants', 'durandal/app'],
    function (userContext, constants, app) {
        "use strict";

        var viewModel = {
            username: null,
            hasStarterAccess: ko.observable(false),
            userPlanChanged: userPlanChanged,
            activate: activate,
            avatarLetter: null
        };

        return viewModel;

        function activate() {
            viewModel.hasStarterAccess(userContext.hasStarterAccess());
            app.on(constants.messages.user.downgraded, userPlanChanged);
            app.on(constants.messages.user.upgraded, userPlanChanged);

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
    }
);