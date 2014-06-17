define(['knockout'], function (ko) {

    ko.bindingHandlers.draggableText = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();

            $(element).draggable({
                containment: "parent",
                cursor: "move",
                drag:  _.debounce(function (event, ui) {
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

            if (value.text()) {
                $(element).show();
                ko.bindingHandlers.text.update(element, function () { return value.text; });
            } else {
                $(element).hide();
            }
            if (value.x()) {
                $(element).css('left', value.x() + 'px');
            }
            if (value.y()) {
                $(element).css('top', value.y() + 'px');
            }
        }
    };

})