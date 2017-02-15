import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';
import msParse from 'parse-duration';

ko.bindingHandlers.cssSingleAnimationStarter = {
    init: (element, valueAccessors) => {
        let data = ko.unwrap(valueAccessors()),
            event = data.event;

        event.subscribe(() => {
            let $element = $(element),
                cssClass = data.class;
            
            $element.addClass(cssClass).width(); //width method forces reflow

            setTimeout(() => {                
                $element.removeClass(cssClass);
            }, msParse($element.css('animation-duration')));
        });
    }
};

composition.addBindingHandler('cssSingleAnimationStarter');