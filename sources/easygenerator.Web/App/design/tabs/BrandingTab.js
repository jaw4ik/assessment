import ko from 'knockout';

import localizationManager from 'localization/localizationManager';

import Backgrounds from './sections/Backgrounds';
import Logo from './sections/Logo';
import Interface from './sections/Interface';

class BrandingTab{

    constructor() {
        this.name = 'branding';
        this.isSelected = ko.observable(true);
        this.title = localizationManager.localize('branding');
        this.type = 'default';
        this.viewUrl = 'design/tabs/BrandingTab.html';

        this.logo = new Logo();
        this.background = new Backgrounds();
        this.colors = new Interface();
    }

    expand(section) {
        [this.logo, this.background, this.colors].forEach(item => item.expanded(section === item));
    }

    activate(settings, defaults){
        return new Promise(resolve => {
            this.logo.activate(settings && settings.branding && settings.branding.logo, defaults && defaults.branding && defaults.branding.logo);
            this.background.activate(settings && settings.branding && settings.branding.background, defaults && defaults.branding && defaults.branding.background);
            this.colors.activate(settings && settings.branding && settings.branding.colors, defaults && defaults.branding && defaults.branding.colors);
            resolve();
        });
    }
}

export default BrandingTab;