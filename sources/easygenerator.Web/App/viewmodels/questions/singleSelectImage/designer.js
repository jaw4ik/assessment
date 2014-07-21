define(['imageUpload',
        'notify',
        'eventTracker',
        'viewmodels/questions/singleSelectImage/answer',
        'viewmodels/questions/singleSelectImage/commands/addAnswer',
        'viewmodels/questions/singleSelectImage/commands/removeAnswer',
        'viewmodels/questions/singleSelectImage/commands/setCorrectAnswer',
        'viewmodels/questions/singleSelectImage/commands/updateAnswerImage',
        'viewmodels/questions/singleSelectImage/queries/getQuestionContentById'],
    function (imageUpload, notify, eventTracker, Answer, addAnswerCommand, removeAnswerCommand, setCorrectAnswerCommand, updateAnswerImageCommand, getQuestionContentById) {
        "use strict";

        var events = {
            addAnswerOption: 'Add answer option (single select image)',
            updateAnswerOption: 'Update answer option (single select image)',
            deleteAnswerOption: 'Delete answer option (single select image)',
            changeAnswerOptionCorrectness: 'Change answer option correctness (single select image)'
        };

        var self = {
            questionId: null
        };

        var viewModel = {
            activate: activate,
            correctAnswerId: ko.observable(null),

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,
            addAnswer: addAnswer,
            removeAnswer: removeAnswer,
            updateAnswerImage: updateAnswerImage,
            setCorrectAnswer: setCorrectAnswer,
            answers: ko.observableArray()
        };

        viewModel.canRemoveAnswer = ko.computed(function () {
            return viewModel.answers().length > 2;
        });

        return viewModel;

        function activate(questionId) {
            self.questionId = questionId;

            return getQuestionContentById.execute(questionId).then(function (question) {
                if (question) {
                    viewModel.correctAnswerId(question.correctAnswerId);

                    viewModel.answers(_.chain(question.answers)
                        .sortBy(function (answer) {
                            return answer.CreatedOn;
                        })
                        .map(function (answer) {
                            return new Answer(answer.Id, answer.Image);
                        })
                        .value());

                } else {
                    viewModel.correctAnswerId(null);
                    viewModel.answers([]);
                }
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function addAnswer() {
            eventTracker.publish(events.addAnswerOption);
            imageUpload.upload({
                success: function (url) {
                    addAnswerCommand.execute(self.questionId, url).then(function (id) {
                        viewModel.answers.push(new Answer(id, url));
                        notify.saved();
                    });
                }
            });
        }

        function removeAnswer(answer) {
            eventTracker.publish(events.deleteAnswerOption);
            removeAnswerCommand.execute(self.questionId, answer.id).then(function (data) {
                viewModel.correctAnswerId(data ? data.correctAnswerId : null);
                viewModel.answers.remove(answer);
                notify.saved();
            });
        }

        function updateAnswerImage(answer) {
            eventTracker.publish(events.updateAnswerOption);
            imageUpload.upload({
                success: function (url) {
                    updateAnswerImageCommand.execute(answer.id, url).then(function () {
                        answer.image(url);
                        notify.saved();
                    });
                }
            });
        }

        function setCorrectAnswer(answer) {
            if (answer.id === viewModel.correctAnswerId())
                return;

            eventTracker.publish(events.changeAnswerOptionCorrectness);
            setCorrectAnswerCommand.execute(self.questionId, answer.id).then(function () {
                viewModel.correctAnswerId(answer.id);
                notify.saved();
            });
        }
    }
);