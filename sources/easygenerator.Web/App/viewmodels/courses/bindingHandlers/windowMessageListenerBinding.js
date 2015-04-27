define(['knockout'], function (ko) {

    ko.bindingHandlers.windowMessageListener = {
        init: function (element, valueAccessor) {
            var callBack = valueAccessor();

            if (!_.isFunction(callBack)) {
                return;
            }

            var listener = function (event) {
                var sender = event.source,
                    templateWindow = element.contentWindow;
                if (sender && templateWindow && sender === templateWindow) {
                    callBack(event.data);
                }
            };

            window.addEventListener('message', listener, false);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                window.removeEventListener('message', listener, false);
            });
        }
    };

});