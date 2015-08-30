define(['knockout', 'durandal/composition'], function (ko, composition) {

    ko.bindingHandlers.scrollbar = {
        init: function (element) {
            var scrollbar = null;

            scrollbar = new IScroll(element, {
                mouseWheel: true,
                scrollbars: true
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                scrollbar.destroy();
                scrollbar = null;
            });
        }
    };

    composition.addBindingHandler('scrollbar')

});