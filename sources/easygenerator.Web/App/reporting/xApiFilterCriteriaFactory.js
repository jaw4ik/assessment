import constants from 'constants';
import guard from 'guard';
import _ from 'underscore';

export default class {
    static create(spec) {
        var criteria = {};

        guard.throwIfNotAnObject(spec, 'You should provide specification for filter criteria');

        if (spec.courseId) {
            criteria[constants.reporting.filterKeys.courseId] = spec.courseId;
        }

        if (spec.learningPathId) {
            criteria[constants.reporting.filterKeys.learningPathId] = spec.learningPathId;
        }

        if (spec.verbs) {
            if (_.isString(spec.verbs)) {
                criteria[constants.reporting.filterKeys.verb] = spec.verbs;
            } else if (_.isArray(spec.verbs)) {
                criteria[constants.reporting.filterKeys.verb] = spec.verbs.join(",");
            }
        }

        if (spec.type) {
            criteria[constants.reporting.filterKeys.type] = spec.type;
        }

        if (spec.learnerEmail) {
            var mailto = spec.learnerEmail;

            if (mailto.indexOf('mailto:') !== 0) {
                mailto = `mailto:${mailto}`;
            }

            criteria[constants.reporting.filterKeys.agent] = { objectType: "Agent", mbox: mailto };
        }

        if (spec.limit) {
            criteria[constants.reporting.filterKeys.limit] = spec.limit;
        }

        if (spec.skip) { 
            criteria[constants.reporting.filterKeys.skip] = spec.skip;
        }

        if (spec.attemptIds) {
            if (_.isString(spec.attemptIds)) {
                criteria[constants.reporting.filterKeys.attemptId] = spec.attemptIds;
            } else if (_.isArray(spec.attemptIds)) {
                criteria[constants.reporting.filterKeys.attemptId] = spec.attemptIds.join(",");
            }
        }

        if (spec.parentId) {
            criteria[constants.reporting.filterKeys.parentId] = spec.parentId;
        }

        if (spec.embeded) {
            criteria[constants.reporting.filterKeys.embeded] = true;
        }

        criteria['v'] = +new Date();
        return criteria;
    }
}