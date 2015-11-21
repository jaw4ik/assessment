import co from 'co';
import _ from 'underscore';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import QuestionStatement from 'reporting/viewmodels/questionStatement';
import xApiProvider from 'reporting/xApiProvider';

export default class extends ExpandableStatement  {
    constructor(masteredLrsStatement) {
        super(masteredLrsStatement);
        this.hasScore = this.lrsStatement.score != null;
    }

    expandLoadAction() {
        return co.call(this, function*() {
            const answered = yield xApiProvider.getAnsweredStatements(this.lrsStatement.attemptId, this.lrsStatement.id);
            if (answered && answered.length) {
                const questionStatements = _.map(answered, statement => new QuestionStatement(statement));
                this.children(questionStatements);
                return;
            }
            this.children = null;
        });
    }
}

export var __useDefault = true;