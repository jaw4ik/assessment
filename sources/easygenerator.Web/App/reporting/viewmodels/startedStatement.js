import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import localizationManager from 'localization/localizationManager';

function getLearnerDisplayName(name, email) {
    name = name || localizationManager.localize('reportingInfoNotAvailable');
    email = email || localizationManager.localize('reportingInfoNotAvailable');
    return `${name} (${email})`;
}

export default class extends ExpandableStatement {
    constructor(startedLrsStatement) {
        super(startedLrsStatement);
        this.learnerDisplayName = getLearnerDisplayName(this.lrsStatement.actor.name, this.lrsStatement.actor.email);
        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
    }
}
