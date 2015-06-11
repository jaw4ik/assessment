define(['eventTracker', 'plugins/router', 'constants', 'localization/localizationManager', 'dialogs/upgrade/viewmodels/upgradeDialog'],
    function (eventTracker, router, constants, localizationManager, UpgradeDialog) {
        "use strict";

        var subtitle = localizationManager.localize('videoUpgradeToUpload'),
            text = localizationManager.localize('videoUpgradeToUploadHtml'),
            category = 'Video library';

        return new UpgradeDialog(category, subtitle, text);
    });