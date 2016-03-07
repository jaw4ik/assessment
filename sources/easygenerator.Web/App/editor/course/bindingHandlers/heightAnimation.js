import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';

ko.bindingHandlers.heightAnimation = {
    update: (element, valueAccessor) => {
        let expanded = valueAccessor().expanded,
            $element = $(element),
            duration = +$element.attr('data-animation-duration')||300,
            minHeight = valueAccessor().minHeight || 0,
            overlayHideClass = 'overlay-hide';

        if (expanded) {
            $element.removeClass(overlayHideClass);

            let curHeight = $element.height(),
            autoHeight = $element.css('height', 'auto').height();
            $element.height(curHeight).animate({
                height: autoHeight
            }, duration, function(){
                $element.height('auto');
            });
        }
        else {
            let curHeight = $element.height();
            $element.addClass(overlayHideClass);
            $element.height(curHeight).animate({
                height: minHeight,
            }, duration);
        }
    }
};

composition.addBindingHandler('heightAnimation');
