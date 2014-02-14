define(['guard'], function (guard) {

    var buildCourseFinishedEventData = function (course) {
        guard.throwIfNotAnObject(course, 'Course is not an object');

        return {
            result: Math.round(course.score) / 100,
            objectives: _.map(course.objectives, function (objective) {
                return {
                    id: objective.id,
                    title: objective.title,
                    score: objective.score
                };
            })
        };
    };

    return {
        buildCourseFinishedEventData: buildCourseFinishedEventData
    };
});