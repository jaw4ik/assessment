import ko from 'knockout';
import $ from 'jquery';
import 'velocity-animate';


ko.bindingHandlers.expandBlock = {
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
        let duration = ko.utils.unwrapObservable(valueAccessors().duration) || 300;
        
        if (expanded === element.expanded) {
            return;
        }
        
        if (expanded) {
            $element.velocity("slideDown", { duration: duration });
        } else {
            $element.velocity("slideUp", { duration: duration });
        }

        element.expanded = expanded;
    }
};