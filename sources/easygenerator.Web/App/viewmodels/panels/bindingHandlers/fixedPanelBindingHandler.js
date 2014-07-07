define(['knockout', 'durandal/composition'], function (ko, composition) {
    "use strict";

    var topPosition = 0;

    ko.bindingHandlers.fixedPanel = {
        init: function (element) {

            var $element = $(element);

            topPosition = $element.position().top;

            $('#view_content').scroll(function () {
                calculateTopPosition($element);
            });

            $(window).resize(function () {
                culculateHeight($element);
            });

            _.defer(function () {
                calculateTopPosition($element);
                culculateHeight($element);
            });
        },
        update: function (element, valueAccessor) {
            valueAccessor();

            var $element = $(element);

            calculateTopPosition($element);
            culculateHeight($element);
        }
    };

    composition.addBindingHandler('fixedPanel');

    function calculateTopPosition($element) {
        $element.css('top', (topPosition - $element.parent().position().top) + 'px');
    }

    function culculateHeight($element) {
        $element.height(window.innerHeight - $element.offset().top);
    }

});