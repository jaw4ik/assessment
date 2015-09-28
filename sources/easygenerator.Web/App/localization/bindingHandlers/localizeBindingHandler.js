define(['knockout', 'localization/localizationManager'], function(ko, localizationManager) {
    ko.bindingHandlers.localize = {
        update: function (element, valueAccessor) {
            localizeValue(element, valueAccessor);
        }
    };

    function localizeValue(element, valueAccessor) {
        var value = valueAccessor();

        if (_.isEmpty(value)) {
            return;
        }

        if (_.isDefined(value['text'])) {
            $(element).text(getLocalizedText(value['text']));
        }
        if (_.isDefined(value['placeholder'])) {
            $(element).attr('placeholder', getLocalizedText(value['placeholder']));
        }
        if (_.isDefined(value['value'])) {
            $(element).prop('value', getLocalizedText(value['value']));
        }
        if (_.isDefined(value['title'])) {
            $(element).prop('title', getLocalizedText(value['title']));
        }
        if (_.isDefined(value['html'])) {
            $(element).html(getLocalizedText(value['html']));
        }
        if (_.isDefined(value['data-text'])) {
            $(element).attr('data-text', getLocalizedText(value['data-text']));
        }
    }

    function getLocalizedText(value) {
        if (_.isString(value)) {
            return localizationManager.localize(value);
        } else if (_.isObject(value)) {
            var text = localizationManager.localize(value.key);

            for (var replacement in value.replace) {
                text = text.replace('{' + replacement + '}', value.replace[replacement]);
            }

            return text;
        }
    }
});