import constants from 'constants';
import _ from 'underscore';
import XApiProvider from 'reporting/xApiProvider';
import StartedStatement from 'reporting/viewmodels/startedStatement';
import FinishStatement from 'reporting/viewmodels/finishStatement';
import ObjectiveStatement from 'reporting/viewmodels/objectiveStatement';
import QuestionStatement from 'reporting/viewmodels/questionStatement';

export default class {
    static async getLrsStatements(spec) {
        var statements = await XApiProvider.getCourseStatements(spec.entityId, spec.embeded, spec.take, spec.skip);
        
        return _.map(statements, statementGroup => {
            var startedStatement = _.find(statementGroup.root, statement => statement.verb === constants.reporting.xApiVerbIds.started);

            var finishedStatement = _.find(statementGroup.root, statement => {
                return _.find([constants.reporting.xApiVerbIds.failed, constants.reporting.xApiVerbIds.passed], verb => verb === statement.verb);
            });

            if (finishedStatement) {

                if (spec.embeded) {
                    var mastered = _.map(statementGroup.embeded, embededStatementGroup => {
                        if (!embededStatementGroup || !embededStatementGroup.mastered) {
                            return null;
                        }
                        if (!embededStatementGroup.answered || !embededStatementGroup.answered.length) {
                            return new ObjectiveStatement(embededStatementGroup.mastered);
                        }
                        var answered = _.map(embededStatementGroup.answered, statement => new QuestionStatement(statement));

                        return new ObjectiveStatement(embededStatementGroup.mastered, answered.length ? answered : null);
                    });

                    return new FinishStatement(finishedStatement, startedStatement || null, mastered.length ? mastered : null);
                }

                return new FinishStatement(finishedStatement, startedStatement || null);
            }

            if (startedStatement) {
                return new StartedStatement(startedStatement);
            }

            return null;
        });
    }
}