define(['viewmodels/questions/textMatching/commands/changeAnswerKey',
    'viewmodels/questions/textMatching/commands/changeAnswerValue',
    'eventTracker',
    'notify'],
    function (changeAnswerKeyCommand, changeAnswerValueCommand, eventTracker, notify) {

        return function (id, key, value) {
        var
            that = this,
            self = {
                key: key,
                value: value,
                events: {
                    changeAnswerKey: 'Change answer key',
                    changeAnswerValue: 'Change answer value'
                }
            }
        ;

        this.id = id;
        
        this.key = ko.observable(key);
        this.key.isEditing = ko.observable(false);

        this.changeOriginalKey = function (newKey) {
            self.key = newKey;
        };

        this.key.beginEditText = function () {
            that.key.isEditing(true);
        };

        this.key.endEditText = function () {
            that.key(that.key().trim());
            that.key.isEditing(false);

            if (that.isDeleted)
                return;

            if (_.isEmptyHtmlText(that.key()) || that.key().length > 255) {
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
        this.value.isEditing = ko.observable(false);

        this.changeOriginalValue = function (newValue) {
            self.value = newValue;
        };

        this.value.beginEditText = function () {
            that.value.isEditing(true);
        };

        this.value.endEditText = function () {
            that.value(that.value().trim());
            that.value.isEditing(false);

            if (that.isDeleted)
                return;

            if (_.isEmptyHtmlText(that.value()) || that.value().length > 255) {
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