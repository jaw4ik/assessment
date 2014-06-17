define(['viewmodels/questions/dragAndDrop/commands/changeDropspotText', 'viewmodels/questions/dragAndDrop/commands/changeDropspotPosition', 'notify'], function (changeDropspotText, changeDropspotPosition, notify) {
    return function (id, text, x, y, questionId) {
        var
            that = this,
            self = {
                text: text,
                questionId: questionId
            }
        ;

        this.id = id;
        this.position = {
            x: ko.observable(x),
            y: ko.observable(y),
            endMoveDropspot: function (x, y) {
                changeDropspotPosition.execute(self.questionId, that.id, x, y).then(function () {
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

            changeDropspotText.execute(self.questionId, that.id, that.text).then(function () {
                self.text = that.text();
                notify.saved();
            });
        };
    }
})