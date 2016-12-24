import ko from 'knockout';
import $ from 'jquery';

ko.bindingHandlers.imageLazyLoadBindingHandler = {
    update: (element, valueAccessor) => {
        var value = valueAccessor();
        if (value) {
            var src = value.src;
            var image = new Image();
            image.onload = () => {
                $(element).attr('src', src);
                value.loaded(false);
            };
            image.onerror = () => {
                value.loaded(false);
            };
            if (src !== '') {
                image.src = src;
            } else {
                $(element).attr('src', src);
                value.loaded(false);
            }
        }
    }
};