define(function () {
    'use strict';

    return {
        install: install
    };

    function install() {
        ko.bindingHandlers.cursorTooltip = {
            update: function (element, valueAccessor) {
                var $element = $(element),
                    isVisible = valueAccessor();

                if (isVisible()) {
                    $element.show();
                    $('html').bind('mousemove', updateTooltipPosition);
                } else {
                    $element.hide();
                    $('html').unbind('mousemove', updateTooltipPosition);
                }

                function updateTooltipPosition(evt) {
                    $element.css('top', evt.pageY + 5).css('left', evt.pageX + 5);
                }
            }
        };
    }

});