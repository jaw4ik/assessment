define(['eventManager', 'guard', 'eventDataBuilders/courseEventDataBuilder'],
    function (eventManager, guard, eventDataBuilder) {

        function Course(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.hasIntroductionContent = spec.hasIntroductionContent;
            this.objectives = spec.objectives;
            this.score = spec.score;
            this.isAnswered = false;
            this.getAllQuestions = getAllQuestions;
            this.finish = finish;
            this.calculateScore = calculateScore;
            this.restart = restart;
            this.submitAnswers = submitAnswers;
        }

        function getAllQuestions() {
            var questionsList = [];

            _.each(this.objectives, function (objective) {
                questionsList = questionsList.concat(objective.questions);
            });

            return questionsList;
        }

        var finish = function (callback) {
            eventManager.courseFinished(
                eventDataBuilder.buildCourseFinishedEventData(this), function () {
                    eventManager.turnAllEventsOff();
                    callback();
                });
        };

        var submitAnswers = function (questions) {
            guard.throwIfNotArray(questions, 'Questions is not an array');

            _.each(questions, function (item) {
                var question = item.question;
                question.submitAnswer(item.checkedAnswersIds);
            });

            this.isAnswered = true;
            eventManager.answersSubmitted(
                eventDataBuilder.buildAnswersSubmittedEventData(this)
            );
        };

        var restart = function () {
            eventManager.courseRestart();
            this.isAnswered = false;
            this.score = 0;
            eventManager.courseStarted();
        };

        var calculateScore = function () {
            var result = _.reduce(this.objectives, function (memo, objective) {
                objective.calculateScore();
                return memo + objective.score;
            }, 0);

            this.score = result / this.objectives.length;
        };

        return Course;
    }
);