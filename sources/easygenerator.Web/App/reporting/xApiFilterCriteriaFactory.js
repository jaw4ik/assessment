define(['constants', 'guard'], function (constants, guard) {
    var create = function (spec) {
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

        if (spec.learnerEmail) {
            var mailto = spec.learnerEmail;

            if (mailto.indexOf('mailto:') !== 0) {
                mailto = 'mailto:' + mailto;
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

        criteria['v'] = +new Date();
        return criteria;
    }

    return {
        create: create
    };
});