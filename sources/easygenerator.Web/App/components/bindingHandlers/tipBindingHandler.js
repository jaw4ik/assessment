﻿import ko from 'knockout';
import 'core/bootstrap/tooltip.js';
import moment from 'moment';

import localizationManager from 'localization/localizationManager';

ko.bindingHandlers.tip = {
    init: (element, valueAccessor) => {
        let value = valueAccessor(),
            key = ko.unwrap(value.key),
            text = ko.unwrap(value.text),
            date = ko.unwrap(value.date),
            displayText = '';

        if(key) {
            displayText = localizationManager.localize(key);
        }else if(text){
            displayText = ko.unwrap(value.text);
        }else if (date){
            let dateValue = ko.unwrap(date.value),
                dateFormat= ko.unwrap(date.format) || 'l';

            displayText = moment(dateValue).format(dateFormat);
        }

        $(element).tooltip({
            title: displayText,
            trigger: 'hover',
            container: 'body'
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).tooltip('destroy');
        });
    }
}