define(['viewmodels/questions/dragAndDrop/commands/changeDropspotText', 'viewmodels/questions/dragAndDrop/commands/changeDropspotPosition', 'eventTracker', 'notify'], function (changeDropspotText, changeDropspotPosition, eventTracker, notify) {
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
            endMoveDropspot: function (x, y) {
                changeDropspotPosition.execute(that.id, x, y).then(function () {
                    notify.saved();
                    eventTracker.publish(self.events.changePosition);
                });
            }
        };


        this.text = ko.observable(text);
        this.text.beginEditText = function () {

        };
        this.text.endEditText = function () {
            that.text(that.text().trim());

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