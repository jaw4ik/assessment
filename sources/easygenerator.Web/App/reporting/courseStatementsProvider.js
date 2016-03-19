import constants from 'constants';
import _ from 'underscore';
import XApiProvider from 'reporting/xApiProvider';
import StartedStatement from 'reporting/viewmodels/startedStatement';
import FinishStatement from 'reporting/viewmodels/finishStatement';
import ObjectiveStatement from 'reporting/viewmodels/objectiveStatement';
import questionStatementFactory from 'reporting/viewmodels/questionStatements/questionStatementFactory';

export default class {
    static async getLrsStatements(spec) {
        var statements = await XApiProvider.getCourseStatements(spec.entityId, spec.embeded, spec.take, spec.skip);
        
        return _.map(statements, statementGroup => {
            var startedStatement = _.find(statementGroup.root, statement => statement.verb === constants.reporting.xApiVerbIds.started);

            var finishedStatement = _.find(statementGroup.root, statement => {
                return _.find([constants.reporting.xApiVerbIds.failed, constants.reporting.xApiVerbIds.passed], verb => verb === statement.verb);
            });

            if (!finishedStatement) {
                var progressedStatement = _.sortBy(_.filter(statementGroup.root, statement => statement.verb === constants.reporting.xApiVerbIds.progressed), statement => -statement.date.getTime())[0];
                finishedStatement = progressedStatement;
            }

            if (finishedStatement) {

                if (spec.embeded) {
                    var objectiveStatements = _.map(statementGroup.embeded, embededStatementGroup => {
                        if (!embededStatementGroup || !embededStatementGroup.root || !embededStatementGroup.root.length) {
                            return null;
                        }
                        if ((!embededStatementGroup.answered || !embededStatementGroup.answered.length) && (!embededStatementGroup.experienced || !embededStatementGroup.experienced.length) ) {
                            return spec.progressedHistory ? _.map(embededStatementGroup.root, objectiveStatement => new ObjectiveStatement(objectiveStatement, null))
                                : new ObjectiveStatement(embededStatementGroup.root[0], null);
                        }

                        var answered = embededStatementGroup.answered ? embededStatementGroup.answered : [],
                            experienced = embededStatementGroup.experienced ? embededStatementGroup.experienced : [],
                            questionStatementsModels = _.map(_.union(answered, experienced), statement => questionStatementFactory.createQuestionStatement(statement));

                        var latestObjectiveStatement = new ObjectiveStatement(embededStatementGroup.root[0], questionStatementsModels.length ? questionStatementsModels : null);

                        if (spec.progressedHistory) {
                            embededStatementGroup.root.splice(0, 1);
                            let result = _.map(embededStatementGroup.root, objectiveStatement => new ObjectiveStatement(objectiveStatement, []));
                            result.unshift(latestObjectiveStatement);
                            return result;
                        }
                        return latestObjectiveStatement;
                    });

                    return new FinishStatement(finishedStatement, startedStatement || null, objectiveStatements.length ? objectiveStatements : null);
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