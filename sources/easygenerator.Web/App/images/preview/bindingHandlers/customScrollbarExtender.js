import ko from 'knockout';
import _ from 'underscore';

ko.bindingHandlers.scrollbarImages = {
    init: (element, valueAccessors) => {
        return ko.bindingHandlers.scrollbar.init(element, valueAccessors);
    },
    update: (element, valueAccessors) => {
        let scrollToElementEnabled = valueAccessors().scrollToElementEnabled;
        let scrollToElementClass = valueAccessors().scrollToElementClass;
        let byClass = valueAccessors().byClass;
        let suppressScrollX = _.isBoolean(valueAccessors().suppressScrollX) ? valueAccessors().suppressScrollX : true;
        let suppressScrollY = _.isBoolean(valueAccessors().suppressScrollY) ? valueAccessors().suppressScrollY :  false; // TODO: need to add functionality for y axis
        
        let customScrollbarContainer = byClass ? element.getElementsByClassName(byClass)[0] : element;
        if (scrollToElementEnabled && scrollToElementEnabled()) {
            if (!suppressScrollX) {
                _.defer(function(){
                    let elementToScroll = customScrollbarContainer.getElementsByClassName(scrollToElementClass)[0];
                    if (elementToScroll) {
                        let elementToScrollOffsetLeft = elementToScroll.offsetLeft;
                        let elementToScrollWidth = $(elementToScroll).outerWidth(true);
                        let containerWidth = customScrollbarContainer.offsetWidth;
                        let containerScrollLeft = customScrollbarContainer.scrollLeft;
                        if (containerWidth + containerScrollLeft > (elementToScrollWidth + elementToScrollOffsetLeft)) {
                            if (elementToScrollOffsetLeft < containerScrollLeft) {
                                customScrollbarContainer.scrollLeft = customScrollbarContainer.scrollLeft - elementToScrollWidth;
                            } 
                        } else {
                            customScrollbarContainer.scrollLeft = customScrollbarContainer.scrollLeft + elementToScrollWidth;
                        }
                    }
                });
            }
        }
        return ko.bindingHandlers.scrollbar.update(element, valueAccessors);
    }
};