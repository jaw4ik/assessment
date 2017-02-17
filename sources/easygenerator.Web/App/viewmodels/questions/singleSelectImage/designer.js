define(['images/commands/upload',
        'notify',
        'constants',
        'eventTracker',
        'durandal/app',
        'localization/localizationManager',
        'widgets/imagePreview/viewmodel',
        './answer',
        './commands/addAnswer',
        './commands/removeAnswer',
        './commands/setCorrectAnswer',
        './commands/updateAnswerImage',
        './queries/getQuestionContentById'],
    function (uploadImage, notify, constants, eventTracker, app, localizationManager, imagePreview, Answer, addAnswerCommand, removeAnswerCommand, setCorrectAnswerCommand, updateAnswerImageCommand, getQuestionContentById) {
        "use strict";

        var events = {
            addAnswerOption: 'Add answer option (single select image)',
            updateAnswerOption: 'Update answer option (single select image)',
            deleteAnswerOption: 'Delete answer option (single select image)',
            changeAnswerOptionCorrectness: 'Change answer option correctness (single select image)'
        };

        var viewModel = {
            questionId: null,
            activate: activate,
            correctAnswerId: ko.observable(null),

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,
            addAnswer: addAnswer,
            removeAnswer: removeAnswer,
            updateAnswerImage: updateAnswerImage,
            setCorrectAnswer: setCorrectAnswer,
            finishAswerProcessing: finishAswerProcessing,
            previewAnswerImage: previewAnswerImage,
            answers: ko.observableArray(),
            answerCreatedByCollaborator: answerCreatedByCollaborator,
            answerDeletedByCollaborator: answerDeletedByCollaborator,
            answerImageUpdatedByCollaborator: answerImageUpdatedByCollaborator,
            correctAnswerChangedByCollaborator: correctAnswerChangedByCollaborator
        };

        viewModel.canRemoveAnswer = ko.computed(function () {
            return viewModel.answers().length > 2;
        });

        viewModel.canAddAnswer = ko.computed(function () {
            return viewModel.answers().length >= 2 && (viewModel.answers()[0].hasImage() && viewModel.answers()[1].hasImage());
        });

        app.on(constants.messages.question.singleSelectImage.answerCreatedByCollaborator, answerCreatedByCollaborator);
        app.on(constants.messages.question.singleSelectImage.answerDeletedByCollaborator, answerDeletedByCollaborator);
        app.on(constants.messages.question.singleSelectImage.answerImageUpdatedByCollaborator, answerImageUpdatedByCollaborator);
        app.on(constants.messages.question.singleSelectImage.correctAnswerChangedByCollaborator, correctAnswerChangedByCollaborator);

        return viewModel;

        function activate(questionId) {
            viewModel.questionId = questionId;

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

        function addAnswer(file) {
            eventTracker.publish(events.addAnswerOption);
            var answerToAdd = new Answer(null, null);
            answerToAdd.isProcessing(true);
            answerToAdd.isImageLoading(true);
            viewModel.answers.push(answerToAdd);
            return uploadImage.execute(file)
                .then(function(image) {
                    return addAnswerCommand.execute(viewModel.questionId, image.url).then(function (id) {
                        answerToAdd.id(id);
                        answerToAdd.image(image.url);
                        answerToAdd.isImageLoading(false);
                        notify.saved();
                    });
                }).catch(function(reason) {
                    viewModel.answers.remove(answerToAdd);
                    notify.error(reason);
                });
        }

        function removeAnswer(answer) {
            eventTracker.publish(events.deleteAnswerOption);
            removeAnswerCommand.execute(viewModel.questionId, answer.id).then(function (data) {
                viewModel.correctAnswerId(data ? data.correctAnswerId : null);
                viewModel.answers.remove(answer);
                notify.saved();
            });
        }

        function updateAnswerImage(file) {
            var that = this;
            eventTracker.publish(events.updateAnswerOption);
            that.isEditing(true);
            that.isProcessing(true);
            that.isImageLoading(true);

            return uploadImage.execute(file)
                .then(function (image) {
                    if (that.isDeleted) {
                        viewModel.answers.remove(that);
                        return;
                    }

                    return updateAnswerImageCommand.execute(that.id, image.url).then(function () {
                        that.image(image.url);
                        that.isImageLoading(false);
                        that.isEditing(false);
                        notify.saved();
                    });
                }).catch(function () {
                    if (that.isDeleted) {
                        viewModel.answers.remove(that);
                        return;
                    }

                    that.isImageLoading(false);
                    that.isEditing(false);
                });
        }

        function setCorrectAnswer(answer) {
            if (answer.id() === viewModel.correctAnswerId())
                return;

            eventTracker.publish(events.changeAnswerOptionCorrectness);
            setCorrectAnswerCommand.execute(viewModel.questionId, answer.id()).then(function () {
                viewModel.correctAnswerId(answer.id());
                notify.saved();
            });
        }

        function finishAswerProcessing(answer) {
            answer.isProcessing(false);
        }

        function previewAnswerImage(answer) {
            imagePreview.openPreviewImage(answer.image());
        }

        function answerCreatedByCollaborator(questionId, answer) {
            if (viewModel.questionId != questionId)
                return;

            viewModel.answers.push(new Answer(answer.id, answer.image));
        }

        function answerDeletedByCollaborator(questionId, answerId, correctAnswerId) {
            if (viewModel.questionId != questionId)
                return;

            var answer = _.find(viewModel.answers(), function (item) {
                return item.id() == answerId;
            });

            if (_.isNullOrUndefined(answer))
                return;          

            if (answer.isEditing()) {
                answer.isDeleted = true;
                notify.error(localizationManager.localize('answerOptionHasBeenDeletedByCollaborator'));
            } else {
                viewModel.answers.remove(answer);
            }

            viewModel.correctAnswerId(correctAnswerId);
        }

        function answerImageUpdatedByCollaborator(questionId, answerData) {
            if (viewModel.questionId != questionId)
                return;

            var answer = _.find(viewModel.answers(), function (item) {
                return item.id() == answerData.id;
            });

            if (_.isNullOrUndefined(answer))
                return;

            answer.image(answerData.image);
        }

        function correctAnswerChangedByCollaborator(questionId, correctAnswerId) {
            if (viewModel.questionId != questionId)
                return;

            viewModel.correctAnswerId(correctAnswerId);
        }
    }
);