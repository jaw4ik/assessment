define(['notify', 'constants', 'eventTracker'],
    function (notify, constants, eventTracker) {

        var viewModel = function (content, events, onStartup, callback) {

            var
            text = ko.observable(_.isNull(content) || _.isEmpty(content) ? null : content),
            originalText = ko.observable(text()),
            hasFocus = ko.observable(false),
            isExpanded = ko.observable(onStartup),
            isEditing = ko.observable(false),

            beginEditText = function () {
                eventTracker.publish(events.beginEditText);
                isEditing(true);
                hasFocus(true);
            },

            addContent = function () {
                eventTracker.publish(events.addContent);
                text('');
                isExpanded(true);
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

                if (text() != originalText()) {
                    return callback(text()).then(function () {
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
                isEditing: isEditing,

                isContentDefined: isContentDefined,
                addContent: addContent,
                beginEditText: beginEditText,
                endEditText: endEditText,

                updateText: updateText,

                autosaveInterval: constants.autosaveTimersInterval.entityContent
            };

        };

        return viewModel;
    }
);