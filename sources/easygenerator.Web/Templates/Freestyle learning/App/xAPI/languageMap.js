define(['./settings', './errorsHandler'], function (settings) {

    var LanguageMap = function (texts, languages) {

        if (_.isNullOrUndefined(texts) || (_.isArray(texts) && texts.length == 0)) {
            errorsHandler.handleError('LanguageMap creation error: texts is undefined');
            return;
        }

        if (!_.isArray(texts)) {
            texts = [texts];
        }

        if (_.isNullOrUndefined(languages) || (_.isArray(languages) && languages.length == 0)) {
            languages = [settings.defaultLanguage];
        }

        if (!_.isArray(languages)) {
            languages = [languages];
        }

        if (texts.length != languages.length) {
            errorsHandler.handleError('LanguageMap creation error: number of texts and languages are not the same');
            return;
        }

        for (var i = 0; i < languages.length; i++)
            this[languages[i]] = texts[i];
    };

    return LanguageMap;

});