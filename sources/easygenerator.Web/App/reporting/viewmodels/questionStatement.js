import ExpandableStatement from 'reporting/viewmodels/expandableStatement';

export default class extends ExpandableStatement {
    constructor(answeredLrsStatement) {
        super(answeredLrsStatement);
        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
        this.correct = this.lrsStatement.score === 100;
        this.hasScore = this.lrsStatement.score != null;
        this.hasAnswer = this.lrsStatement.response != null;
        this.answerShown = ko.observable(false);
    }

    showAnswer() {
        this.answerShown(true);
    }

    hideAnswer () {
        this.answerShown(false);
    }
}