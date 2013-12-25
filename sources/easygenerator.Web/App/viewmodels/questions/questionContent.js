﻿define(['repositories/questionRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker'],
    function (repository, localizationManager, notify, constants, eventTracker) {

        var events = {
            addExtraQuestionContent: 'Add extra question content',
            beginEditText: 'Start editing question content',
            endEditText: 'End editing question content'
        };

        var viewModel = function (questionId, content) {

            var
            text = ko.observable(_.isNull(content) || _.isEmpty(content) ? null : content),
            originalText = ko.observable(text()),
            hasFocus = ko.observable(false),
            isExpanded = ko.observable(true),

                beginEditText = function () {
                    eventTracker.publish(events.beginEditText);
                },

                addExtraQuestionContent = function () {
                    eventTracker.publish(events.addExtraQuestionContent);
                    text('');
                    hasFocus(true);
                },


            endEditText = function () {
                eventTracker.publish(events.endEditText);
            },

            updateText = function () {
                if (_.isEmptyHtmlText(text())) {
                    text(null);
                }

                if (text() != originalText()) {
                    repository.updateContent(questionId, text()).then(function (response) {
                        originalText(text());
                        showNotification();
                    });
                }
            },

            isQuestionContentDefined = ko.computed({
                read: function () {
                    return !_.isNullOrUndefined(text());
                }
            }),

            toggleExpand = function () {
                isExpanded(!isExpanded());
            };

            function showNotification() {
                notify.saved();
            }

            return {
                text: text,
                originalText: originalText,
                isExpanded: isExpanded,
                hasFocus: hasFocus,
                toggleExpand: toggleExpand,

                isQuestionContentDefined: isQuestionContentDefined,
                addExtraQuestionContent: addExtraQuestionContent,
                beginEditText: beginEditText,
                endEditText: endEditText,

                updateText: updateText,

                autosaveInterval: constants.autosaveTimersInterval.questionContent
            };

        };

        return viewModel;
    });