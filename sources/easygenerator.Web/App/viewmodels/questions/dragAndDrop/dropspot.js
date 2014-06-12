define(['viewmodels/questions/dragAndDrop/commands/changeDropspotText', 'viewmodels/questions/dragAndDrop/commands/changeDropspotPosition', 'notify'], function (changeDropspotText, changeDropspotPosition, notify) {
    return function (text) {
        var
            that = this,
            self = {
                text: text
            }
        ;

        this.position = {
            x: ko.observable(0),
            y: ko.observable(0),
            endMoveDropspot: function () {
                changeDropspotPosition.execute().then(function () {
                    notify.saved();
                });
            }
        };


        this.text = ko.observable(text);
        this.text.beginEditText = function () {

        };
        this.text.endEditText = function () {
            if (_.isEmptyHtmlText(that.text())) {
                that.text(self.text);
                return;
            }

            changeDropspotText.execute().then(function () {
                self.text = that.text();
                notify.saved();
            });
        };

        ko.computed(function () {
            var x = that.position.x(), y = that.position.y();
            if (x || y) {
                that.position.endMoveDropspot();
            }
        }).extend({ throttle: 500 });
    }
})