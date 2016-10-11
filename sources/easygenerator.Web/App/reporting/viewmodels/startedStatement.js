import ExpandableStatement from './expandableStatement';
import localizationManager from 'localization/localizationManager';

function getLearnerDisplayName(name, email, account) {
    name = name || localizationManager.localize('reportingInfoNotAvailable');
    email = email || (account && account.name) || localizationManager.localize('reportingInfoNotAvailable');
    return `${name} (${email})`;
}

export default class extends ExpandableStatement {
    constructor(startedLrsStatement) {
        super(startedLrsStatement);
        this.learnerDisplayName = getLearnerDisplayName(this.lrsStatement.actor.name, this.lrsStatement.actor.email, this.lrsStatement.actor.account);
        this.learnerAccountHomePage = this.lrsStatement.actor.account && this.lrsStatement.actor.account.homePage;
        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
    }
}
