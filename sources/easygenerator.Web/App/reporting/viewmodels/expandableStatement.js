import userContext from 'userContext';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import constants from 'constants';

export default class {
    constructor(lrsStatement) {
        this.lrsStatement = lrsStatement;
        this.isExpandable = !_.isNullOrUndefined(this.lrsStatement.attemptId);
        this.isExpanded = ko.observable(false);
        this.children = ko.observableArray([]);
        this.hasScore = this.lrsStatement.score != null;
        this.isProgressed = this.lrsStatement.verb === constants.reporting.xApiVerbIds.progressed;
    }

    async expand() {
        let data = await this.load();
        return data && this.isExpanded(true);
    }

    async load() {
        if (!userContext.hasPlusAccess()) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.extendedResults);
            return false;
        }
        if (!this.isExpandable) {
            return false;
        }
        if (this.children === null || this.children().length) {
            return true;
        }
        await this.expandLoadAction();
        return true;
    }

    collapse() {
        this.isExpanded(false);
    }
}