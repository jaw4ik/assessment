define(['userContext', 'widgets/upgradeDialog/viewmodel'], function (userContext, upgradeDialog) {
    "use strict";

    var ExpandableStatement = function (lrsStatement, expandLoadAction) {
        this.lrsStatement = lrsStatement;
        this.isExpandable = !_.isNullOrUndefined(this.lrsStatement.attemptId);
        this.isExpanded = ko.observable(false);
        this.children = ko.observableArray([]);

        this.expandLoadAction = expandLoadAction;
    };

    ExpandableStatement.prototype.expand = function () {
        var that = this;
        return Q.fcall(function () {
            if (!userContext.hasPlusAccess()) {
                var settings = {
                    containerCss: 'upgrade-dialog-extended-results',
                    eventCategory: 'Load extended results',
                    subtitleKey: 'resultsUpgradeForExtendedResultsTitle2',
                    descriptionKey: 'resultsUpgradeForExtendedResultsHtml'
                };
                upgradeDialog.show(settings);
                return undefined;
            }

            if (that.isExpandable) {
                if (that.children === null || that.children().length) {
                    that.isExpanded(true);
                } else {
                    return that.expandLoadAction();
                }
            }
            return undefined;
        });
    }

    ExpandableStatement.prototype.collapse = function () {
        this.isExpanded(false);
    }

    return ExpandableStatement;
});