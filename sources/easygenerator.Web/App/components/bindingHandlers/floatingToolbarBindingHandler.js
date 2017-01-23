import ko from 'knockout';
import $ from 'jquery';
import _ from 'underscore';
import composition from 'durandal/composition';

const headerSize = 65;
const userShift = 10;

function setToolbarPosition($parent, $element, defaultTopValue, parentSizeChanged){
    let parentH = $parent.outerHeight(true);
    let elementH = $element.outerHeight();
    let parentOfsetTop = $parent.offset().top - headerSize - elementH;
    let maxTopValueForElement = parentH - elementH;
    let elementTop = parseInt($element.css('top'));

    if(_.isBoolean(parentSizeChanged) && parentSizeChanged && elementTop + elementH > Math.abs($parent.offset().top)){
        $element.css('top', `${maxTopValueForElement}px`);
        return true;
    }
            
    if ((parentOfsetTop < 0 || $parent.offset().top < elementH + headerSize) && elementTop <= maxTopValueForElement) {
        let topValue = Math.abs(parentOfsetTop + elementH);

        if (topValue > maxTopValueForElement) {
            topValue = maxTopValueForElement;
        } else {
            topValue += userShift;
        }
        $element.css('top', `${topValue}px`);
    }

    if ($parent.offset().top > elementH + headerSize) {
        $element.css('top', `${defaultTopValue}px`);
    }
}

ko.bindingHandlers.floatingToolbar = {
    init: (element, valueAccessors, allBindings, viewModel) => {
        let $element = $(element);
        let value = ko.utils.unwrapObservable(valueAccessors());
        let $parent = $element.closest(`.${value.parent}`);
        let $scrollContainer = $(`.${value.scrollContainer}`);
        let defaultTopValue = parseInt($element.css('top'));

        $element.data('default-top', defaultTopValue);

        $scrollContainer.on('scroll', setToolbarPosition.bind(viewModel, $parent, $element, defaultTopValue));

        setToolbarPosition($parent, $element, defaultTopValue);

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            $scrollContainer.off('scroll', setToolbarPosition);
        });
    },
    update: (element, valueAccessors) => {
        let value = ko.utils.unwrapObservable(valueAccessors());
        let parentSizeChanged = value.parentSizeChanged;
        let $element = $(element);
        let $parent = $element.closest(`.${value.parent}`);
        
        if(parentSizeChanged()){
            setToolbarPosition($parent, $element, $element.data('default-top'), true);
            parentSizeChanged(false);
        }
    }
};

composition.addBindingHandler('floatingToolbar');