import ko from 'knockout';

ko.bindingHandlers.brightness = {
    init:(element, valueAccessor, all, viewModel) => {
        let value = valueAccessor();

        $(element).slider({
            min: -0.8,
            max: 0.8,
            step: 0.1,
            change: (event, ui) => {
                if (_.isFunction(value.change)) {
                    value.change.call(viewModel, ui.value);
                }
            },
        }).wrap('<div class="ui-slider-wrapper"></div>');
    },
    update:(element, valueAccessor) => {
        let value = valueAccessor();
        $(element).slider('value', ko.unwrap(value.value));
    }
}