import ko from 'knockout';
import animate from 'velocity-animate';

ko.bindingHandlers.slideToggle = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        const value = valueAccessor();
        
        const expanded = ko.unwrap(value);
        const duration = ko.unwrap(value.duration) || 300;

        const wrapper = ko.observable(expanded);

        element.style.display = expanded ? 'block' : 'none';

        const subscription = value.subscribe(newValue => {            
            var callback = allBindings.get('slideToggleCallback') || value.callback || () => {};

            if (newValue) {
                $(element).velocity("finish");
                animate(element, 'slideDown', {
                    duration: duration,
                    begin: () => wrapper(true),
                    complete: () => callback()
                });
            } else {
                $(element).velocity("finish");
                animate(element, 'slideUp', {
                    duration: duration,
                    complete: () => wrapper(false)
                });
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            subscription.dispose();
        });

        return ko.bindingHandlers.if.init(element, () => wrapper, allBindings, viewModel, bindingContext);
    }
};