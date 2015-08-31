define(['knockout', 'durandal/composition'], function (ko, composition) {

    ko.bindingHandlers.scrollbar = {
        init: function (element) {
            var scrollbar = null;

            scrollbar = new IScroll(element, {
                mouseWheel: true,
                scrollbars: 'custom',
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