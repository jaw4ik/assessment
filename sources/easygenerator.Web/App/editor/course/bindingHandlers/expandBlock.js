import ko from 'knockout';
import _ from 'underscore';
import composition from 'durandal/composition';
import $ from 'jquery';

var findElementHeight = element => {
    let $element = $(element);
    let height = 0;
    let elementPadding;
}




var findChildrenHeight = element => {
        





        let height = 0;
        debugger;
        $(element).children().each((index, item) => {
            height = height + $(item).outerHeight(true);
        });

        let paddingHeight = $(element).outerHeight() - height;

        //let children = element.childNodes,
        //    elementStyles = window.getComputedStyle(element),
        //    height = parseInt(elementStyles.getPropertyValue('padding-top')) + parseInt(elementStyles.getPropertyValue('padding-bottom'));

        //_.each(children, child => {
        //    if (child.nodeType !== 1) {
        //        return;
        //    }
        //    let childStyles = window.getComputedStyle(child);
        //    let childHeight = parseInt(childStyles.getPropertyValue('height'));
        //    let childMargins = parseInt(childStyles.getPropertyValue('margin-top')) + parseInt(childStyles.getPropertyValue('margin-bottom'));
        //    height += childHeight + childMargins;
        //});

        return height + paddingHeight;
    },
    getHeight = (element, expanded) => expanded ? findChildrenHeight(element) : 0;


ko.bindingHandlers.expandBlock = {
    init: (element, valueAccessors) => {
        const expanded = ko.utils.unwrapObservable(valueAccessors().expanded),
            duration = ko.utils.unwrapObservable(valueAccessors().duration) || '0.3s';

        element.style.height = `${getHeight(element, expanded)}px`;
        element.style.overflow = 'hidden';
        element.style.transition = `all ${duration} linear`;
    },
    update: (element, valueAccessors) => {
        const expanded = ko.utils.unwrapObservable(valueAccessors().expanded);

        element.style.height = `${getHeight(element, expanded)}px`;
    }
};

composition.addBindingHandler('expandBlock');