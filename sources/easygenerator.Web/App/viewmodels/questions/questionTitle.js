define(['eventTracker', 'repositories/questionRepository', 'constants', 'notify', 'clientContext', 'localization/localizationManager'],
    function (eventTracker, questionRepository, constants, notify, clientContext, localizationManager) {
        "use strict";

        var events = {
            updateQuestionTitle: 'Update question title',
            updateInformationTitle: 'Update information title'
        };

        var viewModel = function (_objectiveId, question) {
            var
                objectiveId = _objectiveId,
                questionId = question.id,

                text = (function () {
                    var value = ko.observable(question.title);

                    value.isEditing = ko.observable();
                    value.isValid = ko.computed(function () {
                        var length = value().trim().length;
                        return length > 0 && length <= constants.validation.questionTitleMaxLength;
                    });
                    value.trim = function () {
                        value(value().trim());
                    };

                    return value;
                })(),

                isExpanded = ko.observable(true),
                isCreatedQuestion = false,

                toggleExpand = function () {
                    isExpanded(!isExpanded());
                },

                startEditQuestionTitle = function () {
                    text.isEditing(true);
                },

                endEditQuestionTitle = function () {
                    text.trim();
                    text.isEditing(false);

                    questionRepository.getById(objectiveId, questionId).then(function (response) {
                        var questionTitle = response.title;

                        if (text() == questionTitle) {
                            return;
                        }

                        if (response.type === constants.questionType.informationContent.type) {
                            eventTracker.publish(events.updateInformationTitle, constants.eventCategories.informationContent);
                        } else {
                            eventTracker.publish(events.updateQuestionTitle);
                        }

                        if (text.isValid()) {
                            questionRepository.updateTitle(questionId, text()).then(function () {
                                notify.saved();
                            });
                        } else {
                            text(questionTitle);
                        }
                    }).fail(function () {
                        notify.error(localizationManager.localize('questionNotFoundError'));
                    });;
                };

            var lastCreatedQuestionId = clientContext.get(constants.clientContextKeys.lastCreatedQuestionId) || '';
            clientContext.remove(constants.clientContextKeys.lastCreatedQuestionId);
            isCreatedQuestion = lastCreatedQuestionId === question.id;

            return {
                objectiveId: objectiveId,
                questionId: questionId,
                label: question.type === constants.questionType.informationContent.type ? 'contentTitleLabel' : 'questionTitleLabel',
                text: text,

                isExpanded: isExpanded,
                toggleExpand: toggleExpand,

                isCreatedQuestion: isCreatedQuestion,
                questionTitleMaxLength: constants.validation.questionTitleMaxLength,

                startEditQuestionTitle: startEditQuestionTitle,
                endEditQuestionTitle: endEditQuestionTitle
            };
        };

        return viewModel;

    }
);