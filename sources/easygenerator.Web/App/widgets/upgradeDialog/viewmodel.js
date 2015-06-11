define(['eventTracker', 'plugins/router', 'constants'],
    function (eventTracker, router, constants) {
        "use strict";

        var events = {
            upgradeNow: 'Upgrade now',
            skipUpgrade: 'Skip upgrade'
        };

        var viewmodel = {
            containerCss: ko.observable(''),
            subtitle: ko.observable(''),
            description: ko.observable(''),
            eventCategory: '',

            isShown: ko.observable(false),

            show: show,
            upgrade: upgrade,
            skip: skip
        };

        return viewmodel;

        function show(settings) {
            viewmodel.containerCss(settings.containerCss);
            viewmodel.subtitle (settings.subtitle);
            viewmodel.description(settings.description);
            viewmodel.eventCategory = settings.eventCategory;

            viewmodel.isShown(true);
        }

        function upgrade() {
            eventTracker.publish(events.upgradeNow, viewmodel.eventCategory);
            router.openUrl(constants.upgradeUrl);
            viewmodel.isShown(false);
        }

        function skip() {
            eventTracker.publish(events.skipUpgrade, viewmodel.eventCategory);
            viewmodel.isShown(false);
        }
    });