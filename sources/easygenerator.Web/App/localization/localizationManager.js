define(['cultureInfo', 'jsonReader'], function (cultureInfo, jsonReader) {
    "use strict";

    var translations = null,
        currentCulture = '',
        currentLanguage = '',

        localize = function (key) {
            if (!this.translations) {
                throw new Error('Translations are not initialized.');
            }

            var item = this.translations[key];
            if (_.isNullOrUndefined(item)) {
                throw new Error('A resource with key "' + key + '" was not found');
            }

            return item;
        },

        hasKey = function (key) {
            if (!this.translations) {
                throw new Error('Translations are not initialized.');
            }

            return this.translations.hasOwnProperty(key);
        },

        initialize = function (settings) {
            settings = settings || cultureInfo;
            var that = this;

            that.currentCulture = settings.culture;
            that.currentLanguage = settings.language;

            return jsonReader.read(settings.translationsUrl).then(function (result) {
                that.translations = result;
            });
        };
    
    return {
        translations: translations,
        currentCulture: currentCulture,
        currentLanguage: currentLanguage,

        initialize: initialize,
        localize: localize,
        hasKey: hasKey
    };
});