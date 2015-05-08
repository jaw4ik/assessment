define(['knockout'], function (ko) {

    ko.bindingHandlers.introAnimate = {
        init: function (element) {
            var $element = $(element),
                minHeight = 150,
                contentHeight = $element.find('[data-content]').outerHeight(true);

            $element.css('height', contentHeight <= minHeight ? contentHeight : minHeight);
        },
        update: function (element, valueAccessor) {
            var $element = $(element),
                minHeight = 150,
                contentHeight = $element.find('[data-content]').outerHeight(true),
                isEdititng = ko.unwrap(valueAccessor().isEditing),
                overlayHideClass = 'overlay-hide',
                duration = 400;

            if (isEdititng) {
                $element.animate({
                    height: contentHeight
                }, duration, function () {
                    $element.css('height', 'auto');
                });
            } else {
                contentHeight < minHeight ? $element.addClass(overlayHideClass) : $element.removeClass(overlayHideClass);
                $element.animate({
                    height: contentHeight <= minHeight ? contentHeight : minHeight
                }, duration);
            }
        }
    };

})