import $ from 'jquery';
import ko from 'knockout';
import composition from 'durandal/composition';

ko.bindingHandlers.visibleAnimate = {
    init: (element, valueAccessors) => {
        let $element = $(element);
        let visible = valueAccessors().visible;
        let visibleClass = valueAccessors().visibleClass || 'visible';
        let hiddenClass = valueAccessors().hiddenClass || 'hidden';
        
        let visibleSubscriptions = visible.subscribe(newValue => {
            if (newValue) {
                $element.removeClass(hiddenClass).fadeIn(0).addClass(visibleClass);
            } else {
                $element.removeClass(visibleClass).addClass(hiddenClass).fadeOut();
            }
        });

        visible() ? $element.show() : $element.hide();

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            visibleSubscriptions.dispose();
        });
    },
    update: (element, valueAccessors) => {
        
    }
};

composition.addBindingHandler('visibleAnimate');