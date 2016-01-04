import co from 'co';
import _ from 'underscore';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import QuestionStatement from 'reporting/viewmodels/questionStatement';
import XApiProvider from 'reporting/xApiProvider';

export default class extends ExpandableStatement  {
    constructor(masteredLrsStatement, answeredStatements) {
        super(masteredLrsStatement);
        this.hasScore = this.lrsStatement.score != null;
        if (answeredStatements === null || answeredStatements) {
            answeredStatements ? this.children(answeredStatements) : this.children = null;
        }
    }

    expandLoadAction() {
        return co.call(this, function*() {
            var answered = yield XApiProvider.getAnsweredStatements(this.lrsStatement.attemptId, this.lrsStatement.id);
            if (answered && answered.length) {
                const questionStatements = _.map(answered, statement => new QuestionStatement(statement));
                this.children(questionStatements);
                return;
            }
            this.children = null;
        });
    }
}