ko.bindingHandlers.dropDown = {

    init: function (element, valueAccessor) {
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
            toggleDropDown();
            e.stopPropagation();
        });

        html.click(function () {
            $dropDownList.hide();
            $element.removeClass('active');
        });

        function toggleDropDown() {
            $dropDownList.toggle();
            $element.toggleClass('active');
        }
        
    }
};