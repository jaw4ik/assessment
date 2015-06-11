define(['eventTracker', 'plugins/router', 'constants', 'localization/localizationManager', 'dialogs/upgrade/viewmodels/upgradeDialog'],
    function (eventTracker, router, constants, localizationManager, UpgradeDialog) {
        "use strict";

        var subtitle = localizationManager.localize('resultsUpgradeForExtendedResultsTitle2'),
            text = localizationManager.localize('resultsUpgradeForExtendedResultsHtml'),
            category = 'Load extended results';

        return new UpgradeDialog(category, subtitle, text);
    });