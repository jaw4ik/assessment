define(['notify', 'constants', 'eventTracker', 'utils/fillInTheBlankParser'], function (notify, constants, eventTracker, fillInTheBlankParser) {
    "use strict";

    var viewModel = function (template, answerOptions, events, onStartup, callback) {

        var fillInTheBlank = fillInTheBlankParser.getData(template, answerOptions);

        var
        text = ko.observable(_.isNull(fillInTheBlank) || _.isEmpty(fillInTheBlank) ? null : fillInTheBlank),
        originalText = ko.observable(text()),
        hasFocus = ko.observable(false),
        isExpanded = ko.observable(true),
        isEditing = ko.observable(false),

        beginEditText = function () {
            eventTracker.publish(events.beginEditText);
            isEditing(true);
        },

        addFillInTheBlank = function () {
            eventTracker.publish(events.addFillInTheBlank);
            text('');
            hasFocus(true);
        },

        endEditText = function () {
            eventTracker.publish(events.endEditText);
            isEditing(false);
        },

        updateText = function () {
            if (_.isEmptyHtmlText(text())) {
                text(null);
            }

            var result = fillInTheBlankParser.getTemplateAndAnswers(text());

            if (text() != originalText()) {
                return callback(result.template, result.answers).then(function () {
                    originalText(text());
                    showNotification();
                });
            }
        },

        isContentDefined = ko.computed({
            read: function () {
                return !_.isNullOrUndefined(text());
            }
        }),

        toggleExpand = function () {
            isExpanded(!isExpanded());
        },
            
        updatedByCollaborator = function (question) {
            var updatedFillInTheBlank = fillInTheBlankParser.getData(question.content, question.answers);
            originalText(updatedFillInTheBlank);

            if (!isEditing())
                text(updatedFillInTheBlank);
        };

        function showNotification() {
            notify.saved();
        }

        return {
            text: text,
            originalText: originalText,
            hasFocus: hasFocus,
            isExpanded: isExpanded,
            toggleExpand: toggleExpand,

            isContentDefined: isContentDefined,
            addFillInTheBlank: addFillInTheBlank,
            beginEditText: beginEditText,
            endEditText: endEditText,
            isEditing: isEditing,

            updateText: updateText,
            updatedByCollaborator: updatedByCollaborator,

            autosaveInterval: constants.autosaveTimersInterval.entityContent
        };

    };

    return viewModel;

});