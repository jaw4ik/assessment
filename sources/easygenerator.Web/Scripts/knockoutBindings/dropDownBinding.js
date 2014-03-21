ko.bindingHandlers.dropDown = {

    init: function (element) {
        var $element = $(element),
            html = $('html'),
            $dropDownList = $element.find('ul');

        $element.click(function (e) {
            _.each($('.dropdown-list'), function (item) {
                if (item != $dropDownList[0]) {
                    $(item).hide();
                    $(item).closest('.dropdown-list-wrapper').removeClass('active');
                }
            });
            $dropDownList.toggle();
            $element.toggleClass('active');
            e.stopPropagation();
        });

        html.click(function () {
            $dropDownList.hide();
            $element.removeClass('active');
        });
    },
};