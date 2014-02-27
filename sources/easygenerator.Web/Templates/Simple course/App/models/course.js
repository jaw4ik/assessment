define(['eventManager', 'eventDataBuilders/courseEventDataBuilder'],
    function (eventManager, eventDataBuilder) {

        function Course(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.hasIntroductionContent = spec.hasIntroductionContent;
            this.objectives = spec.objectives;
            this.score = spec.score;
            this.finish = finish;
            this.calculateScore = calculateScore;
        }

        var finish = function (callback) {
            eventManager.courseFinished(eventDataBuilder.buildCourseFinishedEventData(this), function () {
                eventManager.turnAllEventsOff();
                callback();
            });
        };

        var calculateScore = function () {
            var result = _.reduce(this.objectives, function (memo, objective) {
                objective.calculateScore();
                return memo + objective.score;
            }, 0);

            var objectivesLength = this.objectives.length;
            this.score = objectivesLength == 0 ? 0 : result / objectivesLength;
        };

        return Course;
    }
);