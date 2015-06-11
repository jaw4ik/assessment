define(['eventTracker', 'plugins/router', 'constants', 'localization/localizationManager', 'dialogs/upgrade/viewmodels/upgradeDialog'],
    function (eventTracker, router, constants, localizationManager, UpgradeDialog) {
        "use strict";

        var subtitle = localizationManager.localize('resultsUpgradeForDownloadCSVDialogTitle2'),
            text = localizationManager.localize('resultsUpgradeForDownloadCSVDialogHtml'),
            category = 'Download results CSV';

        return new UpgradeDialog(category, subtitle, text);
    });