define(function () {
    'use strict';

    return {
        install: install
    };

    function install() {
        ko.bindingHandlers.hotspotOnImageTextEditor = {
            init: function (element, valueAccessor) {
                var $element = $(element);
                $element.on('mousedown', function (evt) {
                    evt.stopPropagation();
                });
            },
            update: function (element, valueAccessor) {
                var $element = $(element),
                    isVisible = valueAccessor().isVisible,
                    close = valueAccessor().close,
                    $html = $('html');

                if (isVisible()) {
                    $element.show();
                    _.defer(function () {
                        $html.on('mousedown', close);
                    });
                } else {
                    $element.hide();
                    $html.off('mousedown', close);
                }
            }
        };
    }

});