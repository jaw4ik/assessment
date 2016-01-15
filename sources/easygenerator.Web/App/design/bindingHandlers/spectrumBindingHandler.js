import $ from 'jquery';
import ko from 'knockout';
import _ from 'underscore';

import colorpicker from 'spectrum-colorpicker';
import 'spectrum-colorpicker/spectrum.css!';

colorpicker($);

ko.bindingHandlers.spectrum = {
    init: (element, valueAccessor) => {
        let value = valueAccessor();

        let color = value.color;
        let valueChanged = value.changed;

        $(element).spectrum({
            preferredFormat: 'hex',
            color: ko.unwrap(color),
            showInput: false,
            showPalette: false,
            showButtons: false,
            flat: true
        }).on('move.spectrum', _.debounce((e, c) => {
            if (ko.unwrap(color) === c.toHexString()) {
                return;
            }
            if (ko.isWritableObservable(color)) {
                color(c.toHexString());
            }
            if (_.isFunction(valueChanged)) {
                valueChanged();
            }
        }, 250));

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => $(element).spectrum('destroy'));
    },
    update: (element, valueAccessor) => {
        let value = valueAccessor();
        $(element).spectrum('set', ko.unwrap(value.color));
    }
}