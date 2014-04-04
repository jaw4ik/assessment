define(['eventManager', 'guard', 'eventDataBuilders/questionEventDataBuilder', 'plugins/http'],
    function (eventManager, guard, eventDataBuilder, http) {

        var model = function (spec) {
            return {
                id: spec.id,
                objectiveId: spec.objectiveId,
                title: spec.title,
                hasContent: spec.hasContent,
                score: ko.observable(spec.score),
                answers: spec.answers,
                learningContents: spec.learningContents,
                isAnswered: false,
                isCorrectAnswered: false,
                loadContent: loadContent,
                content: null,
                submitAnswer: submitAnswer,
                learningContentExperienced: learningContentExperienced,
                loadLearningContent: loadLearningContent,
                load: load
            };
        };

        var submitAnswer = function (checkedAnswerIds) {
            guard.throwIfNotArray(checkedAnswerIds, 'Checked answer ids is not an array');

            _.each(this.answers, function (answer) {
                answer.isChecked = _.contains(checkedAnswerIds, answer.id);
            });

            this.score(calculateScore(this.answers));
            this.isAnswered = true;
            this.isCorrectAnswered = this.score() == 100;

            eventManager.answersSubmitted(
                eventDataBuilder.buildAnswersSubmittedEventData(this)
            );
        };

        var learningContentExperienced = function (spentTime) {
            eventManager.learningContentExperienced(
                eventDataBuilder.buildLearningContentExperiencedEventData(this, spentTime)
            );
        };

        var calculateScore = function (answers) {
            var hasIncorrectCheckedAnswer = _.some(answers, function (answer) {
                return answer.isChecked != answer.isCorrect;
            });

            return hasIncorrectCheckedAnswer ? 0 : 100;
        };

        var loadContent = function () {
            var that = this;
            return Q.fcall(function () {
                if (!that.hasContent || !_.isNullOrUndefined(that.content)) {
                    return;
                }

                var contentUrl = 'content/' + that.objectiveId + '/' + that.id + '/content.html';
                return http.get(contentUrl)
                    .then(function (response) {
                        that.content = response;
                    })
                    .fail(function () {
                        that.content = '';
                    });
            });
        };

        var loadLearningContent = function () {
            var that = this;
            var requests = [];
            _.each(that.learningContents, function (item) {
                if (_.isNullOrUndefined(item.content)) {
                    requests.push(http.get('content/' + that.objectiveId + '/' + that.id + '/' + item.id + '.html')
                        .then(function (response) {
                            item.content = response;
                        }));
                }
            });

            return Q.allSettled(requests);
        };


        function load() {
            var that = this;
            return that.loadContent().then(function () {
                return that.loadLearningContent();
            });
        }

        return model;
    });