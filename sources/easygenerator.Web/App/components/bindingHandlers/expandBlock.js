import ko from 'knockout';
import $ from 'jquery';
import animate from 'velocity-animate';

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
        let expanded = ko.utils.unwrapObservable(valueAccessors().expanded);
        let duration = ko.utils.unwrapObservable(valueAccessors().duration) || 300;
        let animationEnabled = ko.utils.unwrapObservable(valueAccessors().animationEnabled);
        let $element = $(element);

        if (expanded === element.expanded) {
            return;
        }

        if (expanded) {
            if(animationEnabled) {
                animate(element, "slideDown", { duration: duration });
            } else {
                $element.show();
            }
        } else {
            if(animationEnabled) {
                animate(element, "slideUp", { duration: duration });
            } else {
                $element.hide();
            }
        }

        element.expanded = expanded;
    }
};