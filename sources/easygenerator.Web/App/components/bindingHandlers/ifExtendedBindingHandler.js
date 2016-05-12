import ko from 'knockout';
import _ from 'underscore';

ko.bindingHandlers.ifExtended = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        let value = valueAccessor().value,
            delayOnFalse = valueAccessor().delayOnFalse || 0,
            currentValue = ko.unwrap(value),
            wrapper = ko.observable(currentValue),
            timerId = null;

        const subscription = value.subscribe(newValue => {
            if(timerId){
                clearTimeout(timerId);
                timerId = null;
            }

            if (newValue) {
                wrapper(true);
            } else {
                if (!delayOnFalse)
                    return;

                timerId = _.delay(() => {
                    wrapper(false);
                    timerId = null;
                }, delayOnFalse);
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            subscription.dispose();
            if(timerId){
                clearTimeout(timerId);
                timerId = null;
            }
        });

        return ko.bindingHandlers.if.init(element, () => wrapper, allBindings, viewModel, bindingContext);
    }
};