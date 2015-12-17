import ko from 'knockout';
import $ from 'jquery';

ko.bindingHandlers.expandableBlock = {
    init: (element, valueAccessors) => {
        let $element = $(element);
        let expanded = ko.utils.unwrapObservable(valueAccessors().expanded);

        if (expanded) {
            $element.show();
        } else {
            $element.hide();
        }

        element.expanded = expanded;
    },
    update: (element, valueAccessors) => {
        let $element = $(element);
        let expanded = ko.utils.unwrapObservable(valueAccessors().expanded);
        let duration = ko.utils.unwrapObservable(valueAccessors().duration) || '0.3s';

        if (expanded === element.expanded) {
            return;
        }

        if (expanded) {
            $element.stop().animate({ height: 'show' }, duration, () => $element.css('height', 'auto'));
        } else {
            $element.stop().animate({ height: 'hide' }, duration);
        }

        element.expanded = expanded;
    }
};