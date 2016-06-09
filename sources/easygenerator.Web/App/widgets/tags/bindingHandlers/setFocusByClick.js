import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';

ko.bindingHandlers.setFocusByClick = {
    init: function (element, valueAccessor) {
        let $element = $(element),
            selector = valueAccessor().selector;

        $element.click((event) => $(selector, event.target).focus());
    }
};

composition.addBindingHandler('setFocusByClick');
