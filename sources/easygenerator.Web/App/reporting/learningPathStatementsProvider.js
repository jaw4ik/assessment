import _ from 'underscore';
import XApiProvider from 'reporting/xApiProvider';
import ProgressedStatement from 'reporting/viewmodels/progressedStatement';

export default class {
    static async getLrsStatements(spec) {
        var statements = await XApiProvider.getLearningPathFinishedStatements(spec.entityId, spec.take, spec.skip);
        return _.map(statements, statement => new ProgressedStatement(statement));
    }
}