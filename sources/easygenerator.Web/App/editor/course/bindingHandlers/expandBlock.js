import ko from 'knockout';
import _ from 'underscore';
import composition from 'durandal/composition';
import $ from 'jquery';

ko.bindingHandlers.expandBlock = {
    update: (element, valueAccessors) => {
        let $element = $(element);
        let expanded = ko.utils.unwrapObservable(valueAccessors().expanded);
        let duration = ko.utils.unwrapObservable(valueAccessors().duration) || '0.3s';

        if (expanded) {
            $element.stop().animate({ height: 'show' }, duration);
        } else {
            $element.stop().animate({ height: 'hide' }, duration);
        }
    }
};

composition.addBindingHandler('expandBlock');