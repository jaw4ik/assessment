define(['eventTracker', 'plugins/router', 'constants'],
    function (eventTracker, router, constants) {
        "use strict";

        var category = 'Load extended results',
            events = {
                upgradeNow: 'Upgrade now',
                skipUpgrade: 'Skip upgrade'
            };

        var viewModel = {
            isShown: ko.observable(false),
            
            show: show,
            hide: hide,

            upgrade: upgrade,
            skip: skip
        };

        return viewModel;

        function show() {
            viewModel.isShown(true);
        }

        function hide() {
            viewModel.isShown(false);
        }

        function upgrade() {
            eventTracker.publish(events.upgradeNow, category);
            router.openUrl(constants.upgradeUrl);
            hide();
        }

        function skip() {
            eventTracker.publish(events.skipUpgrade, category);
            hide();
        }
    });