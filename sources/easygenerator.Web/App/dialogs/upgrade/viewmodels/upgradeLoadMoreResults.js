define(['eventTracker', 'plugins/router', 'constants', 'localization/localizationManager', 'dialogs/upgrade/viewmodels/upgradeDialog'],
    function (eventTracker, router, constants, localizationManager, UpgradeDialog) {
        "use strict";

        var subtitle = localizationManager.localize('resultsUpgradeDialogTitle2'),
            text = localizationManager.localize('resultsUpgradeDialogText'),
            category = 'Load more results';

        return new UpgradeDialog(category, subtitle, text);
    });