import $ from 'jquery';
import ko from 'knockout';

ko.bindingHandlers.slideToggle = {
    init: (element, valueAccess) => {
        var value = valueAccess();

        if (ko.unwrap(value)) {
            $(element).show();
        } else {
            $(element).hide();
        }
    },
    update: (element, valueAccess) => {
        var value = valueAccess();

        if (ko.unwrap(value)) {
            $(element).slideDown(250, () => {
            });

        } else {
            $(element).slideUp(250, () => {
                $(element).hide();
            });
        }
    }
}