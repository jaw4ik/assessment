import constants from 'constants';
import _ from 'underscore';
import XApiProvider from 'reporting/xApiProvider';
import StartedStatement from 'reporting/viewmodels/startedStatement';
import ProgressedStatement from 'reporting/viewmodels/progressedStatement';
import SectionStatement from 'reporting/viewmodels/sectionStatement';
import questionStatementFactory from 'reporting/viewmodels/questionStatements/questionStatementFactory';

export default class {
    static async getLrsStatements(spec) {
        var statements = await XApiProvider.getCourseStatements(spec.entityId, spec.embeded, spec.take, spec.skip);
        
        return _.map(statements, statementGroup => {
            var startedStatement = _.find(statementGroup.root, statement => statement.verb === constants.reporting.xApiVerbIds.started);

            var progressedStatement = _.find(statementGroup.root, statement => {
                return _.find([constants.reporting.xApiVerbIds.failed, constants.reporting.xApiVerbIds.passed], verb => verb === statement.verb);
            });

            if (!progressedStatement) {
                let progressed = _.sortBy(_.filter(statementGroup.root, statement => statement.verb === constants.reporting.xApiVerbIds.progressed), statement => -statement.date.getTime())[0];
                progressedStatement = progressed;
            }

            if (progressedStatement) {

                if (spec.embeded) {
                    var sectionStatements = _.map(statementGroup.embeded, embededStatementGroup => {
                        if (!embededStatementGroup || !embededStatementGroup.root || !embededStatementGroup.root.length) {
                            return null;
                        }
                        if ((!embededStatementGroup.answered || !embededStatementGroup.answered.length) && (!embededStatementGroup.experienced || !embededStatementGroup.experienced.length) ) {
                            return spec.progressedHistory ? _.map(embededStatementGroup.root, sectionStatement => new SectionStatement(sectionStatement, null))
                                : new SectionStatement(embededStatementGroup.root[0], null);
                        }

                        var answered = embededStatementGroup.answered ? embededStatementGroup.answered : [],
                            experienced = embededStatementGroup.experienced ? embededStatementGroup.experienced : [],
                            questionStatementsModels = _.map(_.union(answered, experienced), statement => questionStatementFactory.createQuestionStatement(statement));

                        var latestSectionStatement = new SectionStatement(embededStatementGroup.root[0], questionStatementsModels.length ? questionStatementsModels : null);

                        if (spec.progressedHistory) {
                            embededStatementGroup.root.splice(0, 1);
                            let result = _.map(embededStatementGroup.root, sectionStatement => new SectionStatement(sectionStatement, []));
                            result.unshift(latestSectionStatement);
                            return result;
                        }
                        return latestSectionStatement;
                    });

                    return new ProgressedStatement(progressedStatement, startedStatement || null, sectionStatements.length ? sectionStatements : null);
                }

                return new ProgressedStatement(progressedStatement, startedStatement || null);
            }

            if (startedStatement) {
                return new StartedStatement(startedStatement);
            }

            return null;
        });
    }
}