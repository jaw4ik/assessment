define(['knockout'], function (ko) {

    ko.bindingHandlers.elementCollapse = {
        update: function (element, valueAccessor) {
            var $container = $(element),
                value = ko.unwrap(valueAccessor());

            var $elemForCollapse = $container.find("[data-animate]");

            if (value) {
                $container.animate({
                    height: 'hide'
                });
                $elemForCollapse.animate({
                    top: $container.height() * -1
                });
            } else {
                $container.animate({
                    height: 'show'
                });
                $elemForCollapse.animate({
                    top: 0
                });
            }
        }
    };

})