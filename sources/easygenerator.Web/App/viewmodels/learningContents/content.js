define(['knockout', 'repositories/learningContentRepository'],
    function (ko, learningContentsrepository) {
        "use strict";

        var viewModel = function (id, text, type, questionId) {
            var that = this;
            this.id = id || '';
            this.questionId = questionId;
            this.text = ko.observable(text || '');
            this.originalText = text || '';
            this.type = type;
            this.hasFocus = ko.observable(false);
            this.isDeleted = ko.observable(false);

            if (_.isEmpty(this.id)) {
                this.hasFocus(true);
            }

            this.updateText = function () {
                var id = ko.unwrap(that.id);
                var text = ko.unwrap(that.text);

                if (_.isEmptyHtmlText(text) || ((!_.isNullOrUndefined(that.isDeleted) && that.isDeleted))) {
                    return;
                }

                if (_.isEmptyOrWhitespace(id)) {
                    learningContentsrepository.addLearningContent(viewModel.questionId, { text: text }).then(function (item) {
                        that.id(item.id);
                        that.originalText = text;
                        showNotification(item.createdOn);
                    });
                } else {
                    if (text != that.originalText) {
                        learningContentsrepository.updateText(viewModel.questionId, id, text).then(function (response) {
                            that.originalText = text;
                            showNotification(response.modifiedOn);
                        });
                    }
                }
            };

            this.removeLearningContent = function() {
                publishActualEvent(events.deleteLearningContent);

                if (!_.isNullOrUndefined(learningContent.isDeleted) && learningContent.isDeleted) {
                    viewModel.learningContents.remove(learningContent);
                    return;
                }

                performActionWhenLearningContentIdIsSet(learningContent, function() {
                    viewModel.learningContents.remove(learningContent);
                    learningContentsrepository.removeLearningContent(viewModel.questionId, ko.unwrap(learningContent.id)).then(function(response) {
                        showNotification(response.modifiedOn);
                    });
                });
            };

            function publishActualEvent(event) {
                if (viewModel.questionType === constants.questionType.informationContent.type) {
                    eventTracker.publish(event, constants.eventCategories.informationContent);
                } else {
                    eventTracker.publish(event);
                }
            }

        };

        return viewModel;
    }
);