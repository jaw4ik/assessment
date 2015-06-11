define(['knockout', 'viewmodels/learningContents/learningContentBase'],
    function (ko, LearningContentBase) {
        "use strict";

        var
            events = {
                addLearningContent: 'Add learning content',
                deleteLearningContent: 'Delete learning content',
                beginEditText: 'Start editing learning content',
                endEditText: 'End editing learning content',
                restoreLearningContent: 'Undo delete learning content'
            };

        var viewModel = function (learningContent, questionId, questionType, canBeAddedImmediately) {
            var that = this;
            LearningContentBase.call(this, learningContent, questionId, questionType, canBeAddedImmediately);

            this.beginEditText = function () {
                that.publishActualEvent(events.beginEditText);
            };

            this.endEditText = function () {
                that.publishActualEvent(events.endEditText);
                that.endEditLearningContent();
            };

            this.remove = function () {
                that.publishActualEvent(events.deleteLearningContent);
                that.removeLearningContent();
            };

            this.restore = function () {
                if (!that.isRemoved()) {
                    return;
                }

                that.publishActualEvent(events.restoreLearningContent);
                that.restoreLearningContent();
            }

            if (_.isEmpty(this.id())) {
                this.publishActualEvent(events.addLearningContent);
                this.hasFocus(true);
            }
        };

        return viewModel;
    }
);