define(['eventTracker', 'plugins/router', 'constants', 'localization/localizationManager', 'widgets/upgradeDialog/viewmodel'],
    function (eventTracker, router, constants, localizationManager, UpgradeDialog) {
        "use strict";

        return new UpgradeDialog('Video library');
    });