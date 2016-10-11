import ko from 'knockout';

ko.bindingHandlers.windowMessageListener = {
    init: function (element, valueAccessor) {
        var options = valueAccessor();
        var callBack = options.callBack;
        var originUrl = options.originUrl;

        if (!_.isFunction(callBack)) {
            return;
        }

        var listener = function (event) {
            var sender = event.source,
                frameWindow = element.contentWindow;
            if (!sender || !frameWindow || sender !== frameWindow) {
                return;
            }
            if (_.isNullOrUndefined(originUrl)) {
                callBack(event.data);
                return;
            }
            if (event.origin !== originUrl) {
                return;
            }
            callBack(event.data);
        };

        window.addEventListener('message', listener, false);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            window.removeEventListener('message', listener, false);
        });
    }
};