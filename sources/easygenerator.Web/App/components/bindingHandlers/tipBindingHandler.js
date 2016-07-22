import ko from 'knockout';
import 'core/bootstrap/tooltip.js';
import moment from 'moment';

import localizationManager from 'localization/localizationManager';

ko.bindingHandlers.tip = {
    update: (element, valueAccessor) => {
        let value = valueAccessor(),
            key = ko.unwrap(value.key),
            text = value.text,
            date = ko.unwrap(value.date),
            placement = value.placement || 'auto top',
            isShown = ko.utils.unwrapObservable(value.isShown),
            cssContainer = ko.unwrap(value.cssContainer),
            container = ko.unwrap(value.container) || 'body',
            displayText = '';

        if(key) {
            displayText = localizationManager.localize(key);
        }else if(text){
            displayText = value.text;
        }else if (date){
            let dateValue = ko.unwrap(date.value),
                dateFormat= ko.unwrap(date.format) || 'l';

            displayText = moment(dateValue).format(dateFormat);
        }

        let options = {
            title: displayText,
            trigger: 'hover',
            container: container,
            placement: placement
        };

        if (cssContainer) {
            options.template = `<div class="tooltip"><div class="${cssContainer}"><span class="tooltip-inner"></span></div></div>`;
        }

        if (isShown === false) {
            $(element).tooltip('destroy');
        } else {
            $(element).tooltip(options);
        }
        
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).tooltip('destroy');
        });
    }
}