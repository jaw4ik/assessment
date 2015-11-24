import ko from 'knockout';
import _ from 'underscore';
import composition from 'durandal/composition';

var findChildrenHeight = element => {
        let children = element.childNodes,
            height = 0;

        _.each(children, child => {
            (child.nodeType === 1) && (height += child.offsetHeight);
        });

        return height;
    },
    getHeight = (element, expanded) => expanded ? findChildrenHeight(element) : 0;


ko.bindingHandlers.expandBlock = {
    init: (element, valueAccessors) => {
        const expanded = ko.utils.unwrapObservable(valueAccessors().expanded),
            duration = ko.utils.unwrapObservable(valueAccessors().duration) || '0.3s';

        element.style.height = `${getHeight(element, expanded)}px`;
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration} linear`;
    },
    update: (element, valueAccessors) => {
        const expanded = ko.utils.unwrapObservable(valueAccessors().expanded);

        element.style.height = `${getHeight(element, expanded)}px`;
    }
};

composition.addBindingHandler('expandBlock');