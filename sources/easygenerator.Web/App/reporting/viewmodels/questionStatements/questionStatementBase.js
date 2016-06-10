import ExpandableStatement from './../expandableStatement';

export default class extends ExpandableStatement {
    constructor(statement) {
        super(statement);
        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
        this.correct = this.lrsStatement.score === 100;
        this.hasScore = this.lrsStatement.score != null;
    }
}