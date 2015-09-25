define(['jsonReader'], function (jsonReader) {
    "use strict";

    var
        defaultCulture = "en",
        supportedCultures = [
            "en", 'uk', 'zh-cn', 'pt-br', 'fr'
        ],
        currentCulture = defaultCulture,
        currentLanguage = '',
        resources = null,

        localize = function (key) {
            if (!resources) {
                throw new Error('The resources are not initialized');
            }

            var item = resources[key];
            if (_.isNullOrUndefined(item)) {
                throw new Error('A resource with key "' + key + '" was not found');
            }

            return item;
        },

        hasKey = function (key) {
            return resources.hasOwnProperty(key);
        },

        addLangTagToHtml = function(lang) {
            $('html').attr('lang', lang);
        },

        initialize = function (userCultures) {
            userCultures = userCultures || [];

            var
                match = null,
                i = 0, j = 0,
                uclength = userCultures.length,
                sclength = supportedCultures.length;

            for (i = 0; i < uclength; i++) {
                if (_.isString(match)) {
                    break;
                }
                for (j = 0; j < sclength; j++) {
                    if (userCultures[i].toLowerCase() === supportedCultures[j].toLowerCase() ||
                        userCultures[i].toLowerCase().substring(0, 2) === supportedCultures[j].toLowerCase()) {
                        match = supportedCultures[j];
                        break;
                    }
                }
            }

            this.currentCulture = _.isString(match) ? match : defaultCulture;
            this.currentLanguage = this.currentCulture.substring(0, 2);

            jsonReader.read('content/lang/' + this.currentCulture + '.json').then(function (translations) {
                resources = translations;
            });
            addLangTagToHtml(this.currentCulture);
        };


    (function () {
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

            var localizationManager = require("localization/localizationManager");
            
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
        };
    })();

    return {
        initialize: initialize,
        currentCulture: currentCulture,
        currentLanguage: currentLanguage,
        localize: localize,
        defaultCulture: defaultCulture,
        supportedCultures: supportedCultures,
        hasKey: hasKey
    };
});