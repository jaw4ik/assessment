import $ from 'jquery';
import ko from 'knockout';

import 'core/bootstrap/tooltip.js';

import localizationManager from 'localization/localizationManager';

ko.bindingHandlers.tip = {
    init(element, valueAccessor) {
        let value = valueAccessor();
        
        let key = ko.unwrap(value.key);
        let text = ko.unwrap(value.text) || key ? localizationManager.localize(key) : '';

        $(element).tooltip({
            title: text,
            trigger: 'hover',
            container: 'body'
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).tooltip('destroy');
        });
    }
}
