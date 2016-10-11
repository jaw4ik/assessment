import $ from 'jquery';
import ko from 'knockout';
import composition from 'durandal/composition';

ko.bindingHandlers.resizable = {
    init: (element, valueAccessor) => {
        let init = ko.unwrap(valueAccessor().init),
            handler = valueAccessor().handler;

        if (!init) {
            return;
        }

        $(element).resizable({
            handles: 's',
            minHeight: 60,
            resize: function (event, data) {
                handler(data.size.width, data.size.height);
                data.element.height('auto');
            }
        });
    },
    update: (element, valueAccessor) => {
        let init = ko.unwrap(valueAccessor().init),
            enabled = ko.unwrap(valueAccessor().enabled);

        if (!init) {
            return;
        }

        $(element).resizable(enabled ? 'enable' : 'disable');
    }
};

composition.addBindingHandler('resizable');