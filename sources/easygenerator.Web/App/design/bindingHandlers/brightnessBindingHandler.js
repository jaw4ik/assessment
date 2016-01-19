import ko from 'knockout';

ko.bindingHandlers.brightness = {
    init:(element, valueAccessor, all, viewModel) => {
        let value = valueAccessor();

        let dark = $('<div>').css({ position: 'absolute', left: 0, right: '50%', height: '100%', background: 'rgba(0, 0, 0, 0.4)' }).hide();
        let light = $('<div>').css({ position: 'absolute', left: '50%', right: '50%', height: '100%', background: 'rgba(255, 255, 255, 0.6)' }).hide();
        let apply = val => {
            if (val < 0) {
                dark.show();
                dark.css({
                    left: Math.round((0.8 + val) / 1.6 * 100) + '%'
                });
            } else {
                dark.hide();
            }
            if (val > 0) {
                light.show();
                light.css({
                    right: Math.round((0.8 - val) / 1.6 * 100) + '%'
                });
            } else {
                light.hide();
            }
        };

        $(element).slider({
            min: -0.8,
            max: 0.8,
            step: 0.1,
            change: (event, ui) => {
                apply(ui.value);
                if (_.isFunction(value.change)) {
                    value.change.call(viewModel, ui.value);
                }
            },
            slide: (event, ui ) => apply(ui.value)
        }).wrap('<div class="ui-slider-wrapper"></div>');

        dark.prependTo($(element));
        light.prependTo($(element));
    },
    update:(element, valueAccessor) => {
        let value = valueAccessor();
        $(element).slider('value', ko.unwrap(value.value));
    }
}