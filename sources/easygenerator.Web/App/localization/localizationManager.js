define(['jsonReader'], function (jsonReader) {
    "use strict";

    var
        defaultCulture = "en",
        supportedCultures = [
            "en", 'uk', 'zh-cn', 'pt-br', 'fr'
        ],
        currentCulture = defaultCulture,
        currentLanguage = '',
        translations = null,

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

        addLangTagToHtml = function(lang) {
            $('html').attr('lang', lang);
        },

        initialize = function (userCultures) {
            userCultures = userCultures || [];

            var that = this,
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

            that.currentCulture = _.isString(match) ? match : defaultCulture;
            that.currentLanguage = that.currentCulture.substring(0, 2);

            addLangTagToHtml(that.currentCulture);
            
            return jsonReader.read('/app/localization/lang/' + that.currentCulture + '.json').then(function (translations) {
                console.log(translations);
                that.translations = translations;
            });
        };
    
    return {
        initialize: initialize,
        currentCulture: currentCulture,
        currentLanguage: currentLanguage,
        localize: localize,
        defaultCulture: defaultCulture,
        supportedCultures: supportedCultures,
        hasKey: hasKey,
        translations: translations
    };
});