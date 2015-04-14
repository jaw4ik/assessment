ko.bindingHandlers.expander = {
    init: function (element, valueAccessor) {
        var
            $element = $(element),
            isExpanded = valueAccessor().isExpanded(),
            minSize = valueAccessor().minSize,
            maxSize = valueAccessor().maxSize,
                
            initialWidth = isExpanded ? maxSize : minSize;

        $element.width(initialWidth).css('min-width', initialWidth);
    },
    update: function (element, valueAccessor) {
        var
            $element = $(element),
            isExpanded = valueAccessor().isExpanded(),
            minSize = valueAccessor().minSize,
            maxSize = valueAccessor().maxSize,
            speed = valueAccessor().speed || 400,
            onCollapsed = valueAccessor().onCollapsed,

            widthToResize = isExpanded ? maxSize : minSize;

        if ($element.width() === widthToResize) {
            return;
        }

        var animateSettings = {};
        animateSettings['width'] = widthToResize + 'px';
        animateSettings['min-width'] = widthToResize + 'px';

        var animation = $element.finish().animate(animateSettings, speed);

        $.when(animation).done(function () {
            if (onCollapsed && !isExpanded) {
                onCollapsed();
            }
        });
    }
};