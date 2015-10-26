ko.bindingHandlers.fadeIn = {
    update: function (element, valueAccessor) {
        var value = valueAccessor(),
            $element = $(element),
            predicate = ko.unwrap(value.predicate),
            hideCallback = value.hideCallback,
            showDuration = ko.unwrap(value.showDuration),
            duration = ko.unwrap(value.duration) || 200,
            cssShown = 'shown';

        if (predicate) {
            $element
                .fadeTo(duration, 1)
                .addClass(cssShown);
            if (showDuration) {
                _.delay(function () {
                    $element
                        .removeClass(cssShown)
                        .fadeTo(duration, 0, hideCallback);
                }, showDuration > duration ? showDuration - duration : showDuration);
            }
        } else {
            $element
                .removeClass(cssShown)
                .fadeOut(duration);
        }
    }
};