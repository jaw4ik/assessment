import ko from 'knockout';

ko.bindingHandlers.hasfocus = {
    update: (element, valueAccessor) => {
        var value = ko.utils.unwrapObservable(valueAccessor());
        setTimeout(() => {
            if (value
                && element.offsetWidth && element.offsetHeight
                && document.activeElement && document.activeElement != element)
            {
                element.focus();
                ko.utils.triggerEvent(element, "focusin"); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
            } 
        }, 4);
    }
};
