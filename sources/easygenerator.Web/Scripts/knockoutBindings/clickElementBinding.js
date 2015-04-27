ko.bindingHandlers.clickElement = {
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped && element.href && element.href) {
            if (element) {
                if (document.createEvent) {
                    var evt = document.createEvent('MouseEvents');
                    evt.initEvent('click', true, false);
                    element.dispatchEvent(evt);
                } else if (document.createEventObject) {
                    element.fireEvent('onclick');
                } else if (typeof element.onclick == 'function') {
                    element.onclick();
                }
                if (element.href) {
                    element.href = '';
                }
            }
        }
    }
};