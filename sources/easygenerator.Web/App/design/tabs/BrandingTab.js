import ko from 'knockout';

import localizationManager from 'localization/localizationManager';

import Backgrounds from './branding/backgrounds/Backgrounds';
import Logo from './branding/courseLogo/Logo';
import Interface from './branding/interfaceColors/Interface';

class BrandingTab{

    constructor() {
        this.name = 'branding';
        this.isSelected = ko.observable(false);
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

    activate(settings, defaults, allowEdit){
        return new Promise(resolve => {
            this.logo.activate(settings && settings.branding && settings.branding.logo, defaults && defaults.branding && defaults.branding.logo, allowEdit);
            this.background.activate(settings && settings.branding && settings.branding.background, defaults && defaults.branding && defaults.branding.background, allowEdit);
            this.colors.activate(settings && settings.branding && settings.branding.colors, defaults && defaults.branding && defaults.branding.colors, allowEdit);
            resolve();
        });
    }
}

export default BrandingTab;