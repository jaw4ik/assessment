import ko from 'knockout';
import _ from 'underscore';
import 'core/bootstrap/tooltip.js';
import moment from 'moment';
import localizationManager from 'localization/localizationManager';

ko.bindingHandlers.tip = {
    init: (element) => {
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => $(element).tooltip('destroy'));
    },
    update: (element, valueAccessor) => {
        let value = valueAccessor(),

            key = ko.unwrap(value.key),
            text = ko.unwrap(value.text),
            date = ko.unwrap(value.date),

            placement = value.placement || 'auto top',
            isShown = _.isUndefined(value.isShown) ? true : ko.unwrap(value.isShown),
            cssContainer = ko.unwrap(value.cssContainer),
            container = ko.unwrap(value.container) || 'body',
            maxWidth = value.maxWidth,

            displayText = '';

        $(element).tooltip('destroy');
        if (!isShown) {
            return;
        }

        if (key) {
            displayText = localizationManager.localize(key);
        } else if (text) {
            displayText = text;
        } else if (date) {
            let dateValue = ko.unwrap(date.value),
                dateFormat = ko.unwrap(date.format) || 'l';

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
        } else if (maxWidth) {
            options.template = `<div class="tooltip"><div class="tooltip-arrow"></div><div style="max-width:${maxWidth}px" class="tooltip-inner"></div></div>`;
        }

        $(element).tooltip(options);
    }
};