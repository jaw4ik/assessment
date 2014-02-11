define(['context'],
    function (context) {
        function QuestionsNavigation() {
            var self = this;
            
            self.nextQuestionUrl = ko.observable('');
            self.previousQuestionUrl = ko.observable('');
            self.showTitle = ko.observable(false);
            self.questionsCount = 0;
            self.currentQuestionIndex = 0;
            
            self.isNextQuestionAvailable = ko.computed(function () {
                return !_.isNullOrUndefined(self.nextQuestionUrl()) && !_.isEmptyOrWhitespace(self.nextQuestionUrl());
            });

            self.isPreviousQuestionAvailable = ko.computed(function () {
                return !_.isNullOrUndefined(self.previousQuestionUrl()) && !_.isEmptyOrWhitespace(self.previousQuestionUrl());
            });

            self.activate = function (activationData) {
                return Q.fcall(function () {
                    var objectiveId = activationData.objectiveId;
                    var questionId = activationData.questionId;

                    var objective = _getItemById(context.course.objectives, objectiveId);

                    if (objective && objective.questions) {
                        var currentItemIndex = _getItemIndexById(objective.questions, questionId);
                        if (currentItemIndex > -1) {
                            self.showTitle(activationData.showTitle);
                            self.previousQuestionUrl(_getQuestionUrl(objective, objective.questions[currentItemIndex - 1]));
                            self.nextQuestionUrl(_getQuestionUrl(objective, objective.questions[currentItemIndex + 1]));
                            self.questionsCount = objective.questions.length;
                            self.currentQuestionIndex = currentItemIndex + 1;
                        }
                    }
                });
            };

            function _getItemIndexById(collection, itemId) {
                for (var i = 0, count = collection.length; i < count; i++) {
                    if (collection[i].id === itemId) {
                        return i;
                    }
                }
                return -1;
            }

            function _getQuestionUrl(objective, question) {
                if (objective && question) {
                    return '#/objective/' + objective.id + '/question/' + question.id;
                }
                return undefined;
            }

            function _getItemById(collection, itemId) {
                return _.find(collection, function (item) {
                    return item.id == itemId;
                });
            }
        }

        return QuestionsNavigation;
    }
);