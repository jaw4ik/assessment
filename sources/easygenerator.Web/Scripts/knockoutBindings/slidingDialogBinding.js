ko.bindingHandlers.slidingDialog = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            collapseOnOuterClick = valueAccessor().collapseOnOuterClick,
            isExpanded = valueAccessor().isExpanded;

        if (collapseOnOuterClick) {
            $('html').click(function () {
                isExpanded(false);
            });

            $element.on('click', function (evt) {
                evt.stopPropagation();
            });
        }
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            isExpanded = valueAccessor().isExpanded(),
            position = valueAccessor().position,
            side = valueAccessor().side,
            speed = valueAccessor().speed,
            onCollapsed = valueAccessor().onCollapsed,
            cssClassOnCollapsed = valueAccessor().cssClassOnCollapsed,
            animateValue = isExpanded ? '0px' : position;

        if (!speed) {
            speed = 400;
        }

        if (cssClassOnCollapsed) {
            if (isExpanded) {
                $element.addClass(cssClassOnCollapsed);
            } else {
                $element.removeClass(cssClassOnCollapsed);
            }
        }

        var animateSettings = {};
        animateSettings[side] = animateValue;

        var animation = $element.animate(animateSettings, speed);

        if (onCollapsed && !isExpanded) {
            $.when(animation).done(function () {
                onCollapsed();
            });
        }
    }
};