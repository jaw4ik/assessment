define(['notify', 'constants', 'eventTracker', './fillInTheBlankParser'],
 function (notify, constants, eventTracker, fillInTheBlankParser) {
     "use strict";

     return function (template, answerOptions, events, onStartup, callback) {
        var self = {
            showNotification: function () {
                notify.saved();
            }
        };

        var that = this;
        var fillInTheBlank = fillInTheBlankParser.getData(template, answerOptions);

        this.autosaveInterval = constants.autosaveTimersInterval.entityContent;
        this.text = ko.observable(_.isNull(fillInTheBlank) || _.isEmpty(fillInTheBlank) ? '' : fillInTheBlank);
        this.originalText = ko.observable(this.text());
        this.hasFocus = ko.observable(false);
        this.isExpanded = ko.observable(true);
        this.isEditing = ko.observable(false);


        this.beginEditText = function () {
            eventTracker.publish(events.beginEditText);
            that.isEditing(true);
        }

        this.addFillInTheBlank = function () {
            eventTracker.publish(events.addFillInTheBlank);
            that.hasFocus(true);
        }

        this.endEditText = function () {
            that.updateText();

            eventTracker.publish(events.endEditText);
            that.isEditing(false);
        }

        this.updateText = function () {
            if (_.isEmptyHtmlText(that.text())) {
                that.text('');
            }
            var result = fillInTheBlankParser.getTemplateAndAnswers(that.text());

            if (that.text() != that.originalText()) {
                return callback(result.template, result.answers).then(function () {
                    that.originalText(that.text());
                    self.showNotification();
                });
            }
        }

        this.isEmpty = ko.computed({
            read: function () {
                return _.isEmptyHtmlText(that.text()) && !that.hasFocus();
            }
        });

        this.toggleExpand = function () {
            that.isExpanded(!that.isExpanded());
        }

        this.updatedByCollaborator = function (question) {
            if (_.isNullOrUndefined(question.content)) {
                that.text('');
                that.originalText(that.text());
                return;
            }

            var updatedFillInTheBlank = fillInTheBlankParser.getData(question.content, question.answers);
            that.originalText(updatedFillInTheBlank);

            if (!that.isEditing())
                that.text(updatedFillInTheBlank);
        }
     };
 });