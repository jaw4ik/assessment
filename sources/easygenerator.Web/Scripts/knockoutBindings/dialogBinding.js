ko.bindingHandlers.dialog = {
    init: function (element) {
        var $element = $(element),
            $popup = $element.find('.dialog'),
            $hidePopup = $element.find('.hideDialog');

        $popup.css('margin-left', $popup.width() / 2 * -1);
        $popup.css('margin-top', $popup.height() / 2 * -1);

        $element.fadeIn('slow');

        $hidePopup.on('click', function() {
            $element.fadeOut('slow');
        });
    }
};