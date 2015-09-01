define(['knockout', 'durandal/composition'], function (ko, composition) {

    ko.bindingHandlers.scrollbar = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                byClass = valueAccessor().byClass,
                scrollbar = null,
                options = {
                    mouseWheel: true,
                    disableMouse: true,
                    scrollbars: 'custom',
                    interactiveScrollbars: true
                };

            if (byClass) {
                scrollbar = new IScroll($element.find('.' + byClass)[0], options);
            } else {
                scrollbar = new IScroll(element, options);
            }

            _.defer(function() {
                scrollbar.refresh();
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                scrollbar.destroy();
                scrollbar = null;
            });

            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        }
    };

    composition.addBindingHandler('scrollbar');

});