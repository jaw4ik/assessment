ko.bindingHandlers.focusHandler = {
    init: function () {
    },

    update: function () {

        var elem = '.user-form-input',
            wrapper = elem + '-wrapper';

        $(elem).focusin(function () {
        }).blur(function () {
        }).focusin();

        $(wrapper).click(function () {
            if ($(this).find(elem).is(':focus')) {
                $(this).bind('click mousedown mouseup', function () {
                    return false;
                });
            } else {
                $(this).bind('click mousedown mouseup', function () {
                    return false;
                }).find(elem).focus();
            }
        });

        $(elem).focusin(function () {
            $(this).parent(wrapper).addClass('focus');
        });
        $(elem).blur(function () {
            $(this).parent(wrapper).removeClass('focus');
        });
    }
};