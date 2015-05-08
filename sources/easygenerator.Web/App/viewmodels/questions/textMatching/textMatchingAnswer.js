define(['viewmodels/questions/textMatching/commands/changeAnswerKey',
    'viewmodels/questions/textMatching/commands/changeAnswerValue',
    'eventTracker',
    'notify',
    'constants'],
    function (changeAnswerKeyCommand, changeAnswerValueCommand, eventTracker, notify, constants) {

        return function (id, key, value, hasFocus) {
        var
            that = this,
            self = {
                key: key,
                value: value,
                events: {
                    changeAnswerKey: 'Change answer key (text matching)',
                    changeAnswerValue: 'Change answer value (text matching)'
                }
            }
        ;

        this.id = id;

        this.key = ko.observable(key);
        this.key.hasFocus = ko.observable(hasFocus);

        this.key.isValid = ko.computed(function() {
            return !_.isEmptyHtmlText(that.key()) && that.key().length <= constants.validation.textMatchingKeyMaxLength;
        });

        this.changeOriginalKey = function (newKey) {
            self.key = newKey;
        };

        this.key.beginEditText = function () {
            that.key.hasFocus(true);
        };

        this.key.endEditText = function () {
            that.key(that.key().trim());
            that.key.hasFocus(false);

            if (that.isDeleted)
                return;

            if (!that.key.isValid()) {
                that.key(self.key);
                return;
            }

            if (self.key == that.key()) {
                return;
            }

            changeAnswerKeyCommand.execute(that.id, that.key).then(function () {
                self.key = that.key();
                notify.saved();
                eventTracker.publish(self.events.changeAnswerKey);
            });
        };

        this.value = ko.observable(value);
        this.value.hasFocus = ko.observable(false);
        this.value.isValid = ko.computed(function () {
            return !_.isEmptyHtmlText(that.value()) && that.value().length <= constants.validation.textMatchingValueMaxLength;
        });
        this.changeOriginalValue = function (newValue) {
            self.value = newValue;
        };

        this.value.beginEditText = function () {
            that.value.hasFocus(true);
        };

        this.value.endEditText = function () {
            that.value(that.value().trim());
            that.value.hasFocus(false);

            if (that.isDeleted)
                return;

            if (!that.value.isValid()) {
                that.value(self.value);
                return;
            }

            if (self.value == that.value()) {
                return;
            }

            changeAnswerValueCommand.execute(that.id, that.value).then(function () {
                self.value = that.value();
                notify.saved();
                eventTracker.publish(self.events.changeAnswerValue);
            });
        };

        }
})