define(['jsonReader'], function (jsonReader) {
    "use strict";

    var 
        defaultCulture = 'en',
        supportedCultures = ['en', 'uk', 'zh-cn', 'pt-br', 'de', 'nl', 'fr'],
        translations = null,
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

        initialize = function (userCultures, localizationPath) {
            userCultures = userCultures || [];
            localizationPath = localizationPath || '/app/localization/lang/';

            var that = this,
                match = null,
                i = 0,
                j = 0,
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

            that.currentCulture = _.isString(match) ? match : defaultCulture;
            that.currentLanguage = that.currentCulture.substring(0, 2);

            return jsonReader.read(localizationPath + that.currentCulture + '.json').then(function (result) {
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