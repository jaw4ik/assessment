import $ from 'jquery';
import ko from 'knockout';

const css = {
    ratingContainer: 'rating-container',
    ratingItem: 'rating-item',
    checked: 'checked',
    highlighted: 'highlighted'
},
keys = {
    rating: 'rating'
};

ko.bindingHandlers.rating = {
    init: (element, valueAccessors) => {
        let value = ko.utils.unwrapObservable(valueAccessors().value) || 0,
            max = ko.utils.unwrapObservable(valueAccessors().maxRate) || 5,
            $element= $(element)
        ;

        let $container = $("<div></div>");
        $container.addClass(css.ratingContainer);
        $container.appendTo($element);
        $container.mouseout(() => {
            $container.children().each((index, item) => {
                $(item).removeClass(css.highlighted);
            });
        });

        for(let i=0; i<max; i++) {
            let $item = $("<div></div>");
            $item.addClass(css.ratingItem);
            $item.data(keys.rating, i + 1);
            $item.appendTo($container);
            $item.click(() => {
                let rating = $item.data(keys.rating);
                valueAccessors().value(rating);
                applyRatingStyles(rating, css.checked);
            });
            $item.hover(() => {
                let rating = $item.data(keys.rating);
                applyRatingStyles(rating, css.highlighted);
            });
        }

        applyRatingStyles(value, css.checked);

        function applyRatingStyles(rating, className){
            $container.children().each((index, item) => {
                let $item = $(item);
                if(index < rating) {
                    $item.addClass(className);
                }else {
                    $item.removeClass(className);
                }
            });
        }
    }
};