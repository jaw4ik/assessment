ko.bindingHandlers.dialog = {
    init: function () {
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            $container = $('.tb-main'),
            speed = 200,
            isShown = valueAccessor().isShown,
            autoclose = ko.unwrap(valueAccessor().autoclose) || false;

        if (isShown()) {
            show();
        } else {
            hide();
        }

        function show() {
            var $blockout = $('<div class="modal-dialog-blockout" style="display:none;"></div>').appendTo($container);

            $.when($blockout).done(function () {
                $blockout.fadeIn(speed);
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
            $element.fadeOut(speed, function () {
                $('.modal-dialog-blockout').fadeOut(speed, function() {
                    $(this).remove();
                });
            });
        }
    }
};