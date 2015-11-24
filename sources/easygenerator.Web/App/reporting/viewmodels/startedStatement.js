import ExpandableStatement from 'reporting/viewmodels/expandableStatement';

export default class extends ExpandableStatement {
    constructor(startedLrsStatement) {
        super(startedLrsStatement);
        this.learnerDisplayName = `${this.lrsStatement.actor.name} (${this.lrsStatement.actor.email})`;
        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
    }
}