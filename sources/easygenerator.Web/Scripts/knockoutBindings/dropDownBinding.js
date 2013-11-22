ko.bindingHandlers.dropDown = {

    init: function (element) {
        var elem = $(element),
            html = $('html'),
            dropDownHolder = 'header-menu-list-item',
            dropDownList = 'dropdown-list';

        elem.click(function (e) {
            $('.' + dropDownList).toggle();
            $('.' + dropDownHolder).toggleClass('active');
            e.stopPropagation();
        });

        html.click(function () {
            $('.' + dropDownList).hide();
            $('.' + dropDownHolder).removeClass('active');
        });

    },
};