import ko from 'knockout';
import _ from 'underscore';
import composition from 'durandal/composition';
import $ from 'jquery';

var findElementHeight = element => {
    let $element = $(element);
    let height = 0;
    let elementPadding = 0;
    
    $element.children().each((index, item)=>{
        height += $(item).outerHeight(true);
    })
    
    elementPadding = parseInt($element.css('padding-top')) + parseInt($element.css('padding-bottom'));
    
    return height + elementPadding;
};
var getHeight = (element, expanded) => expanded ? findElementHeight(element) : 0;

ko.bindingHandlers.expandBlock = {
    init: (element, valueAccessors) => {
        let $element = $(element);
        let expanded = ko.utils.unwrapObservable(valueAccessors().expanded);
        let duration = ko.utils.unwrapObservable(valueAccessors().duration) || '0.3s';
            
        $element.css('height', getHeight(element, expanded));
        $element.css('overflow', 'hidden');
        $element.css('transition', `height ${duration} linear`);
    },
    update: (element, valueAccessors) => {
        let $element = $(element);
        let expanded = ko.utils.unwrapObservable(valueAccessors().expanded);

        $element.css('height', getHeight(element, expanded));
    }
};

composition.addBindingHandler('expandBlock');