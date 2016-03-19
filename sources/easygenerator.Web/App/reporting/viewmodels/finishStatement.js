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
    constructor(finishedLrsStatement, startedLrsStatement, childStatements) {
        super(finishedLrsStatement);
        this.startedLrsStatement = startedLrsStatement;
        if (childStatements === null || childStatements) {
            childStatements ? this.children(childStatements) : this.children = null;
        }
        this.learnerDisplayName = getLearnerDisplayName(this.lrsStatement.actor.name, this.lrsStatement.actor.email);
        this.passed = this.lrsStatement.verb === constants.reporting.xApiVerbIds.passed;
    }

    async expandLoadAction() {
        let statements = await XApiProvider.getObjectiveStatements(this.lrsStatement.attemptId, this.lrsStatement.date.getTime()),
            objectiveStatements = _.map(statements, statement => new ObjectiveStatement(statement));

        objectiveStatements.length ? this.children(objectiveStatements) : this.children = null;
    }
}