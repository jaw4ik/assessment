import localizationManager from 'localization/localizationManager';

export default class {
    constructor(verbLocalizationKey, descriptionLocalizationKey) {
        this.verb = localizationManager.localize(verbLocalizationKey);
        this.description = localizationManager.localize(descriptionLocalizationKey);
    }
}