ko.bindingHandlers.dropDown = {

    init: function (element) {
        var elem = $(element),
            html = $('html'),
            dropDownList = 'dropdown-list';

        elem.click(function (e) {
            $('.' + dropDownList).toggle();
            e.stopPropagation();
        });

        html.click(function () {
            $('.' + dropDownList).hide();
        });

    },
};