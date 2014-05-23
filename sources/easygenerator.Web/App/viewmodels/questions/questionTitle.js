define(['eventTracker', 'repositories/questionRepository', 'constants', 'notify'], function (eventTracker, questionRepository, constants, notify) {

    "use strict";

    var events = {
        updateQuestionTitle: 'Update question title'
    };

    var questionTitle = function(objectiveId, question) {
        var titleWrapper = {
            title: ko.observable(question.title),
            startEditQuestionTitle: startEditQuestionTitle,
            endEditQuestionTitle: endEditQuestionTitle
        };

        titleWrapper.title.isEditing = ko.observable();

        titleWrapper.title.isValid = ko.computed(function () {
            var length = titleWrapper.title().trim().length;
            return length > 0 && length <= constants.validation.questionTitleMaxLength;
        });

        return titleWrapper;

        function startEditQuestionTitle() {
            titleWrapper.title.isEditing(true);
        }

        function endEditQuestionTitle() {
            titleWrapper.title(titleWrapper.title().trim());
            titleWrapper.title.isEditing(false);

            var questionTitle;
            questionRepository.getById(objectiveId, question.id).then(function(response) {
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
    };

    return questionTitle;

});