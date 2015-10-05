define([], function () {
    'use strict';

    var
        cultureInfo = {
            culture: '',
            language: '',
            translationsUrl: '',
            initialize: initialize
        },

        defaultCulture = 'en',
        supportedCultures = [
            'en', 'uk', 'zh-cn', 'pt-br', 'fr'
        ];

    return cultureInfo;

    function initialize(userCultures) {
        userCultures = userCultures || [];

        var match = null,
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

        var currentCulture = _.isString(match) ? match : defaultCulture;
        cultureInfo.culture = currentCulture,
        cultureInfo.language = currentCulture.substring(0, 2);
        cultureInfo.translationsUrl = '/app/localization/lang/' + currentCulture + '.json';
    }
});