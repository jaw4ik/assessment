ko.bindingHandlers.fadeIn = {
    update: function (element, valueAccessor) {
        var value = valueAccessor(),
            $element = $(element),
            predicate = ko.unwrap(value.predicate),
            hideCallback = value.hideCallback,
            duration = value.duration,
            fadeDuration = 200,
            fadeOutDuration = 500;

        if (predicate) {
            $element.css({ display: 'block', visibility: 'visible' }).fadeTo(fadeDuration, 1);
            if (duration) {
                $element.delay(duration > fadeOutDuration ? duration - fadeOutDuration : duration).fadeOut(fadeOutDuration, hideCallback);
            }
        } else {
            $element.fadeOut(fadeDuration);
        }
    }
};