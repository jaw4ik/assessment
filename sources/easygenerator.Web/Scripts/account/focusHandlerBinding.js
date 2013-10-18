ko.bindingHandlers.focusHandler = {
    init: function () {
    },

    update: function (elem) {
        var inputElem = '.user-form-input';

        $(inputElem).focusin(function () {
            $(this).parent(inputElem + '-wrapper').addClass('focus');
        });
        $(inputElem).focusout(function () {
            $(this).parent(inputElem + '-wrapper').removeClass('focus');
        });
    }
};