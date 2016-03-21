import _ from 'underscore';
import constants from 'constants';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import SectionStatement from 'reporting/viewmodels/sectionStatement';
import XApiProvider from 'reporting/xApiProvider';
import localizationManager from 'localization/localizationManager';

function getLearnerDisplayName(name, email) {
    name = name || localizationManager.localize('reportingInfoNotAvailable');
    email = email || localizationManager.localize('reportingInfoNotAvailable');
    return `${name} (${email})`;
}

export default class extends ExpandableStatement {
    constructor(progressedLrsStatement, startedLrsStatement, childStatements) {
        super(progressedLrsStatement);
        this.startedLrsStatement = startedLrsStatement;
        if (childStatements === null || childStatements) {
            childStatements ? this.children(childStatements) : this.children = null;
        }
        this.learnerDisplayName = getLearnerDisplayName(this.lrsStatement.actor.name, this.lrsStatement.actor.email);
        this.isFinished = this.lrsStatement.verb !== constants.reporting.xApiVerbIds.progressed;
        this.passed = this.lrsStatement.verb === constants.reporting.xApiVerbIds.passed;
    }

    async expandLoadAction() {
        let statements = await XApiProvider.getSectionStatements(this.lrsStatement.attemptId, this.lrsStatement.date.getTime()),
            sectionStatements = _.map(statements, statement => new SectionStatement(statement));

        sectionStatements.length ? this.children(sectionStatements) : this.children = null;
    }
}