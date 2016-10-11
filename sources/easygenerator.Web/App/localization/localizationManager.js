import _ from 'underscore';
import jsonReader from 'jsonReader';
import moment from 'moment';
import modulesLoader from 'modulesLoader';
import htmlEditor from 'components/htmlEditor/editorWrapper';

let
    defaultCulture = 'en',
    supportedCultures = ['en', 'uk', 'zh-cn', 'pt-br', 'de', 'nl', 'fr', 'es', 'it'];

class LocalizationManager{
    constructor() {
        this.translations = null;
        this.currentCulture = '';
        this.currentLanguage = '';
    }

    localize(key){
        if (!this.translations) {
            return key;
            throw new Error('Translations are not initialized.');
        }

        var item = this.translations[key];
        if (_.isNullOrUndefined(item)) {
            throw new Error('A resource with key "' + key + '" was not found');
        }

        return item;
    }

    hasKey(key) {
        if (!this.translations) {
            throw new Error('Translations are not initialized.');
        }

        return this.translations.hasOwnProperty(key);
    }

    initialize(userCultures, localizationPath) {
        userCultures = userCultures || [];
        localizationPath = localizationPath || '/app/localization/lang/';

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

        this.currentCulture = _.isString(match) ? match : defaultCulture;
        this.currentLanguage = this.currentCulture.substring(0, 2);

        htmlEditor.setLanguage(this.currentCulture);

        if (this.currentCulture !== defaultCulture) {
            modulesLoader.import('moment/locale/' + this.currentCulture);
            moment.locale(this.currentCulture);
        }

        return jsonReader.read(localizationPath + this.currentCulture + '.json').then(result => {
            this.translations = result;
        });
    }
}

export default new LocalizationManager();