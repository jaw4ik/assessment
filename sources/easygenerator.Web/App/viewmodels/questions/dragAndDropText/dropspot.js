define(['./commands/changeDropspotText', './commands/changeDropspotPosition', 'eventTracker', 'notify'], function (changeDropspotText, changeDropspotPosition, eventTracker, notify) {
    return function (id, text, x, y) {
        var
            that = this,
            self = {
                text: text,
                events: {
                    changePosition: 'Change dropspot position',
                    changeText: 'Change dropspot text'
                }
            }
        ;

        this.id = id;
        this.position = {
            x: ko.observable(x),
            y: ko.observable(y),
            isMoving: ko.observable(false),
            startMoveDropspot: function() {
                that.position.isMoving(true);
            },
            endMoveDropspot: function (x, y) {
                that.position.isMoving(false);
                if (that.isDeleted)
                    return;

                changeDropspotPosition.execute(that.id, x, y).then(function () {
                    that.position.x(x);
                    that.position.y(y);

                    notify.saved();
                    eventTracker.publish(self.events.changePosition);
                });
            }
        };
        this.size = {
            width: ko.observable(),
            height: ko.observable()
        }

        this.text = ko.observable(text);
        this.text.isEditing = ko.observable(false);

        this.changeOriginalText = function (newText) {
            self.text = newText;
        };

        this.text.beginEditText = function () {
            that.text.isEditing(true);
        };
        this.text.endEditText = function () {
            that.text(that.text().trim());
            that.text.isEditing(false);

            if (that.isDeleted)
                return;

            if (_.isEmptyHtmlText(that.text())) {
                that.text(self.text);
                return;
            }

            if (self.text == that.text()) {
                return;
            }

            changeDropspotText.execute(that.id, that.text).then(function () {
                self.text = that.text();
                notify.saved();
                eventTracker.publish(self.events.changeText);
            });
        };
    }
})