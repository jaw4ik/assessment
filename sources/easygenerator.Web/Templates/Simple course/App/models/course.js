define(['eventManager', 'eventDataBuilders/courseEventDataBuilder'],
    function (eventManager, eventDataBuilder) {

        var ctor = function (spec) {

            var course = {
                id: spec.id,
                title: spec.title,
                hasIntroductionContent: spec.hasIntroductionContent,
                objectives: ko.observableArray(spec.objectives)
            }

            course.score = ko.computed(function () {
                var result = _.reduce(course.objectives(), function (memo, objective) {
                    return memo + objective.score();
                }, 0);

                var objectivesLength = course.objectives().length;
                return objectivesLength == 0 ? 0 : Math.floor(result / objectivesLength);
            });

            course.isCompleted = ko.computed(function () {
                return !_.some(course.objectives(), function(objective) {
                    return !objective.isCompleted();
                });
            });

            course.finish = function (callback) {
                eventManager.courseFinished(eventDataBuilder.buildCourseFinishedEventData(course), function () {
                    eventManager.turnAllEventsOff();
                    callback();
                });
            };

            return course;
        };

        return ctor;
    }
);