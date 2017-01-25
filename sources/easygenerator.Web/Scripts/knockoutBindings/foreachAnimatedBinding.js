ko.bindingHandlers.foreachAnimated = {

    createValueAccessor: function (valueAccessor) {
        var data = valueAccessor().data,
            speed = valueAccessor().speed ? valueAccessor().speed * 1000 : 200,
            hideSpeed = valueAccessor().hideSpeed ? valueAccessor().hideSpeed * 1000 : 200,
            animateOnAdd = _.isUndefined(valueAccessor().animateOnAdd) ? true : valueAccessor().animateOnAdd,
            animationEnabled = _.isUndefined(valueAccessor().animationEnabled) ? true : valueAccessor().animationEnabled,
            removeDelay = valueAccessor().removeDelay ? valueAccessor().removeDelay * 1000 : 0;

        return function () {
            return {
                'data': data,
                'afterAdd': afterAdd,
                'beforeRemove': beforeRemove
            };

            function afterAdd(element) {
                if (!animateOnAdd || element.nodeType != 1) {
                    return;
                }

                if (animationEnabled()) {
                    $(element).hide().slideDown(speed);
                } else {
                    $(element).show()
                }
            }

            function beforeRemove(element) {
                if (element.nodeType != 1) {
                    return;
                }

                var $element = $(element);
                if (animationEnabled()) {
                    $element.children().fadeTo(removeDelay, 0.3, 'easeInQuint', function () {
                        $element.slideUp(hideSpeed, function () {
                            $element.remove();
                        });
                    });
                } else {
                    $element.remove();
                }
            }
        };
    },

    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers.foreach.init(element, ko.bindingHandlers.foreachAnimated.createValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers.foreach.update(element, ko.bindingHandlers.foreachAnimated.createValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
    }
};
