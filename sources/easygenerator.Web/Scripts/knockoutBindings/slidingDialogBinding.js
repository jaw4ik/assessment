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
            cssClassOnExpanded = valueAccessor().cssClassOnExpanded,
            animateValue = isExpanded ? '0px' : position;

        if (!speed) {
            speed = 400;
        }

        var animateSettings = {};
        animateSettings[side] = animateValue;

        var animation = $element.finish().animate(animateSettings, speed);

        if (cssClassOnExpanded && isExpanded) {
            $element.addClass(cssClassOnExpanded);
        }

        $.when(animation).done(function () {
            if (cssClassOnExpanded && !isExpanded) {
                $element.removeClass(cssClassOnExpanded);
            }

            if (onCollapsed && !isExpanded) {
                onCollapsed();
            }
        });
    }
};