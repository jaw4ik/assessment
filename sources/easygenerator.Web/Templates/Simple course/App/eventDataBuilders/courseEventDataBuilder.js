define(['guard'], function (guard) {

    var buildCourseFinishedEventData = function (course) {
        guard.throwIfNotAnObject(course, 'Course is not an object');
        return {
            result: course.score() / 100,
            isCompleted: course.isCompleted(),
            objectives: _.map(course.objectives(), function (objective) {
                return {
                    id: objective.id,
                    title: objective.title,
                    score: objective.score()
                };
            })
        };
    };

    return {
        buildCourseFinishedEventData: buildCourseFinishedEventData
    };
});