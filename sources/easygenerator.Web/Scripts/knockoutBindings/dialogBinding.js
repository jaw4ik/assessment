﻿ko.bindingHandlers.dialog = {
    init: function () {
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            $body = $('body'),
            speed = 200,
            isShown = valueAccessor().isShown,
            autoclose = ko.unwrap(valueAccessor().autoclose) || false;

        if (isShown()) {
            show();
        } else {
            hide();
        }

        function show() {
            var $blockout = $('<div class="modal-dialog-blockout"></div>').appendTo($body);

            $.when($blockout).done(function () {
                $element.fadeIn(speed);
                $element.find('.autofocus').first().focus();
            });

            if (autoclose) {
                $blockout.click(function () {
                    isShown(false);
                });
            }
        }

        function hide() {
            var fadeOut = $element.fadeOut(speed);
            $.when(fadeOut).done(function () {
                $('.modal-dialog-blockout').remove();
            });
        }
    }
};