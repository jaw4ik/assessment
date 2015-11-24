import co from 'co';
import _ from 'underscore';
import constants from 'constants';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import ObjectiveStatement from 'reporting/viewmodels/objectiveStatement';
import xApiProvider from 'reporting/xApiProvider';

export default class extends ExpandableStatement {
    constructor(finishedLrsStatement) {
        super(finishedLrsStatement);
        this.startedLrsStatement = null;
        this.learnerDisplayName = `${this.lrsStatement.actor.name} (${this.lrsStatement.actor.email})`;
        this.passed = this.lrsStatement.verb === constants.reporting.xApiVerbIds.passed;
    }

    expandLoadAction() {
        return co.call(this, function*() {
            var mastered = yield xApiProvider.getMasteredStatements(this.lrsStatement.attemptId),
                started = yield xApiProvider.getStartedStatement(this.lrsStatement.attemptId),
                objectiveStatements = _.map(mastered, statement => new ObjectiveStatement(statement));
            this.startedLrsStatement = started[0];
            this.children(objectiveStatements);
        });
    }
}