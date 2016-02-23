import ko from 'knockout';
import $ from 'jquery';
import _ from 'underscore';

ko.bindingHandlers.expandableBlock = {
    init: (element, valueAccessors) => {
        let $element = $(element),
            expanded = ko.utils.unwrapObservable(valueAccessors().expanded),
            collapsedHeight = valueAccessors().collapsedHeight || 0,
            isExpandable = valueAccessors().isExpandable; 


        $element.css('max-height', 'none');

        if ($element.outerHeight() > collapsedHeight) {
            $element.addClass('expandable');
            if(isExpandable) {
                isExpandable(true);
            }

            if (!expanded) {
                element.initialHeight = $element.outerHeight();
                $element.outerHeight(collapsedHeight);
            }
        }

        element.expanded = expanded;
    },
    update: (element, valueAccessors) => {
        let $element = $(element),
            expanded = ko.utils.unwrapObservable(valueAccessors().expanded),
            duration = ko.utils.unwrapObservable(valueAccessors().duration) || '300',
            collapsedHeight = valueAccessors().collapsedHeight || 0,
            isExpandable = $element.hasClass('expandable');

        if (expanded === element.expanded || !isExpandable) {
            return;
        }

        $element.stop().animate({ height: expanded ? element.initialHeight : collapsedHeight }, duration);

        element.expanded = expanded;
    }
};