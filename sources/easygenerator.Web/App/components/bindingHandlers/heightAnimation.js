import ko from 'knockout';
import $ from 'jquery';
import composition from 'durandal/composition';

const overlayHideClass = 'overlay-hide';

ko.bindingHandlers.heightAnimation = {
    init: (element, valueAccessor) => {
        let initHeight = valueAccessor().initHeight,
            $element = $(element);

        if (initHeight) {
            $element.height(initHeight);
            $element.addClass(overlayHideClass);
        }
    },
    update: (element, valueAccessor) => {
        let expanded = ko.utils.unwrapObservable(valueAccessor().expanded),
            duration = valueAccessor().duration || 300,
            minHeight = valueAccessor().minHeight || 0,
            $element = $(element);
        
        if (expanded) {
            $element.removeClass(overlayHideClass);

            let curHeight = $element.height(),
                autoHeight = $element.height('auto').height();

            if (curHeight < autoHeight) {
                $element
                    .height(curHeight)
                    .animate({ height: autoHeight }, duration, () => {
                        $element.height('auto');
                        $element.css('overflow', 'visible');
                    });
            } else if (curHeight > minHeight) {
                $element
                    .height(minHeight)
                    .animate({ height: autoHeight }, duration, () => {
                        $element.height('auto');
                        $element.css('overflow', 'visible');
                    });
            }
        } else {
            let curHeight = $element.height();
            
            if (curHeight > minHeight) {
                $element.addClass(overlayHideClass);
                $element
                    .height(curHeight)
                    .animate({ height: minHeight }, duration, () => $element.css('overflow', 'hidden'));
            }
        }
    }
};

composition.addBindingHandler('heightAnimation');
