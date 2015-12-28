import co from 'co';
import _ from 'underscore';
import constants from 'constants';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import ObjectiveStatement from 'reporting/viewmodels/objectiveStatement';
import XApiProvider from 'reporting/xApiProvider';
import localizationManager from 'localization/localizationManager';

function getLearnerDisplayName(name, email) {
    name = name || localizationManager.localize('reportingInfoNotAvailable');
    email = email || localizationManager.localize('reportingInfoNotAvailable');
    return `${name} (${email})`;
}

export default class extends ExpandableStatement {
    constructor(finishedLrsStatement, startedLrsStatement, masteredStatements) {
        super(finishedLrsStatement);
        this.startedLrsStatement = startedLrsStatement;
        if (masteredStatements === null || masteredStatements) {
            masteredStatements ? this.children(masteredStatements) : this.children = null;
        }
        this.learnerDisplayName = getLearnerDisplayName(this.lrsStatement.actor.name, this.lrsStatement.actor.email);
        this.passed = this.lrsStatement.verb === constants.reporting.xApiVerbIds.passed;
    }

    expandLoadAction() {
        return co.call(this, function*() {
            var mastered = yield XApiProvider.getMasteredStatements(this.lrsStatement.attemptId),
                objectiveStatements = _.map(mastered, statement => new ObjectiveStatement(statement));

            objectiveStatements.length ? this.children(objectiveStatements) : this.children = null;
        });
    }
}