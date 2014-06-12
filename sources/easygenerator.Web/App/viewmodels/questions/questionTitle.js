define(['eventTracker', 'repositories/questionRepository', 'constants', 'notify', 'durandal/app'],
    function (eventTracker, questionRepository, constants, notify, app) {

        "use strict";

        var events = {
            updateQuestionTitle: 'Update question title'
        };

        var questionTitle = function (objectiveId, question) {
            var titleWrapper = {
                title: ko.observable(question.title),
                startEditQuestionTitle: startEditQuestionTitle,
                endEditQuestionTitle: endEditQuestionTitle,
                titleUpdated: titleUpdated
            };

            titleWrapper.title.isEditing = ko.observable();

            titleWrapper.title.isValid = ko.computed(function () {
                var length = titleWrapper.title().trim().length;
                return length > 0 && length <= constants.validation.questionTitleMaxLength;
            });

            app.on(constants.messages.question.titleUpdatedByCollaborator, titleUpdated);

            return titleWrapper;

            function startEditQuestionTitle() {
                titleWrapper.title.isEditing(true);
            }

            function endEditQuestionTitle() {
                titleWrapper.title(titleWrapper.title().trim());
                titleWrapper.title.isEditing(false);

                var questionTitle;
                questionRepository.getById(objectiveId, question.id).then(function (response) {
                    questionTitle = response.title;

                    if (titleWrapper.title() == questionTitle)
                        return;

                    eventTracker.publish(events.updateQuestionTitle);

                    if (titleWrapper.title.isValid()) {
                        questionRepository.updateTitle(question.id, titleWrapper.title()).then(function () {
                            notify.saved();
                        });
                    } else {
                        titleWrapper.title(questionTitle);
                    }
                });
            }

            function titleUpdated(questionData) {
                if (questionData.id != question.id || titleWrapper.title.isEditing()) {
                    return;
                }

                titleWrapper.title(questionData.title);
            }

        };

        return questionTitle;

    });