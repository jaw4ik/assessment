define(['constants', 'guard'], function (constants, guard) {
    var FilterCriteia = function (spec) {

        guard.throwIfNotAnObject(spec, 'You should provide specification for filter criteria');

        if (spec.courseId) {
            this[constants.reporting.filterKeys.courseId] = spec.courseId;
        }

        if (spec.verbs) {
            if (_.isString(spec.verbs)) {
                this[constants.reporting.filterKeys.verb] = spec.verbs;
            } else if (_.isArray(spec.verbs)) {
                this[constants.reporting.filterKeys.verb] = spec.verbs.join(",");
            }
        }

        if (spec.learnerEmail) {
            var mailto = spec.learnerEmail;

            if (mailto.indexOf('mailto:') !== 0) {
                mailto = 'mailto:' + mailto;
            }

            this[constants.reporting.filterKeys.agent] = { objectType: "Agent", mbox: mailto };
        }

        if (spec.limit) {
            this[constants.reporting.filterKeys.limit] = spec.limit;
        }

        if (spec.skip) {
            this[constants.reporting.filterKeys.skip] = spec.skip;
        }

        if (spec.attemptId) {
            this[constants.reporting.filterKeys.attemptId] = spec.attemptId;
        }

        this['v'] = +new Date();
    }

    return FilterCriteia;
});