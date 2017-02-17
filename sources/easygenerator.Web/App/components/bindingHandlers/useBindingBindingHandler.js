import ko from 'knockout';
import _ from 'underscore';

ko.bindingHandlers.useBinding = {
    init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        var value = valueAccessor();
        if (ko.bindingHandlers.hasOwnProperty(value.name) && _.isFunction(ko.bindingHandlers[value.name].init)) {
            return ko.bindingHandlers[value.name].init(element, () => value.value, allBindings, viewModel, bindingContext);
        }
    },
    update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        var value = valueAccessor();
        if (ko.bindingHandlers.hasOwnProperty(value.name) && _.isFunction(ko.bindingHandlers[value.name].update)) {
            return ko.bindingHandlers[value.name].update(element, () => value.value, allBindings, viewModel, bindingContext);
        }
    }
};