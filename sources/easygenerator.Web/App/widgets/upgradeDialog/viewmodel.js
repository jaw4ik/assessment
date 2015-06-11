define(['eventTracker', 'plugins/router', 'constants'],
    function (eventTracker, router, constants) {
        "use strict";

        var events = {
            upgradeNow: 'Upgrade now',
            skipUpgrade: 'Skip upgrade'
        };

        var ctor = function (category) {
            this.category = category;

            this.isShown = ko.observable(false);
        };

        ctor.prototype.upgrade = function () {
            eventTracker.publish(events.upgradeNow, this.category);
            router.openUrl(constants.upgradeUrl);
            this.isShown(false);
        }

        ctor.prototype.show = function () {
            this.isShown(true);
        }

        ctor.prototype.skip = function () {
            eventTracker.publish(events.skipUpgrade, this.category);
            this.isShown(false);
        }

        return ctor;
    });