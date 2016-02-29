import _ from 'underscore';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import questionStatementFactory from 'reporting/viewmodels/questionStatements/questionStatementFactory';
import XApiProvider from 'reporting/xApiProvider';

export default class extends ExpandableStatement  {
    constructor(masteredLrsStatement, childStatements) {
        super(masteredLrsStatement);
        this.hasScore = this.lrsStatement.score != null;
        if (childStatements === null || childStatements) {
            childStatements ? this.children(childStatements) : this.children = null;
        }
    }

    async expandLoadAction() {
        let statements = await XApiProvider.getObjectiveStatements(this.lrsStatement.attemptId, this.lrsStatement.id);
        if (statements && statements.length) {
            const questionStatements = _.map(statements, statement => questionStatementFactory.createQuestionStatement(statement));
            this.children(questionStatements);
            return;
        }
        this.children = null;
    }
}