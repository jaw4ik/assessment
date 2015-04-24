define(['knockout'], function (ko) {

    ko.bindingHandlers.draggableText = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();

            $(element).draggable({
                containment: "parent",
                cursor: "move",
                scroll: false,
                start: function () {
                    if (_.isFunction(value.startMove)) {
                        value.startMove();
                    }
                },
                drag: _.debounce(function (event, ui) {
                    var
                        x = ui.position.left,
                        y = ui.position.top;

                    if (ko.isWriteableObservable(value.x)) {
                        value.x(x);
                    }
                    if (ko.isWriteableObservable(value.y)) {
                        value.y(y);
                    }

                    if (_.isFunction(value.endMove)) {
                        value.endMove(x, y);
                    }
                }, 500)
            });

            return { 'controlsDescendantBindings': true };
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();

            ko.bindingHandlers.text.update(element, function () { return value.text; });

            if (value.text()) {
                $(element).show();
            } else {
                $(element).hide();
            }

            if (value.x) {
                $(element).css('left', ko.unwrap(value.x) + 'px');
            }
            if (value.y) {
                $(element).css('top', ko.unwrap(value.y) + 'px');
            }

            setTimeout(function () {
                if (ko.isWriteableObservable(value.width)) {
                    value.width($(element).outerWidth());
                }
                if (ko.isWriteableObservable(value.height)) {
                    value.height($(element).outerHeight());
                }
            }, 0);


        }
    };

})