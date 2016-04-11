import ko from 'knockout';
import _ from 'underscore';

import fonts from 'fonts';
import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';

import ContentStyles from './fontsTabSections/contentStyles';
import GeneralStyles from './fontsTabSections/generalStyles';

export default class FontsTab {
    constructor(){
        this.name = 'fonts';
        this.isSelected = ko.observable(false);
        this.title = localizationManager.localize('fonts');
        this.type = 'default';
        this.viewUrl = 'design/tabs/FontsTab.html';

        this.generalStyles = new GeneralStyles();
        this.contentStyles = new ContentStyles();

        this.isLoadingSettings = ko.observable(true);
        this.available = null;
    }

    expand(section) {
        _.each(this.contentStyles.elements(), (element)=>{
            element.isVisible(false);
        });
        [ this.contentStyles, this.generalStyles ].forEach(item => item.expanded(section === item));
    }

    activate(settings, defaults){
        let that = this;
        return new Promise(resolve => {
            this.generalStyles.activate(settings, defaults);
            this.contentStyles.activate(settings, defaults);
            resolve();
        }).then(() => {
            let familiesToLoad = _.map(_.filter(fontFamilies, fontFamily => { return fontFamily.needToLoad }), font => {
                return font.name;
            });
            return fonts.load(familiesToLoad);
        }).then(() => {
            that.isLoadingSettings(false);
            that.available = userContext.hasPlusAccess();
        });
    }
}

export const fontFamilies = [
    {
        name: 'Arial',
        needToLoad: false
    },
    {
        name: 'Bad Script',
        needToLoad: true
    },
    {
        name: 'Ledger',
        needToLoad: true
    },
    {
        name: 'Open Sans',
        needToLoad: false
    },
    {
        name: 'PT Sans',
        needToLoad: true
    },
    {
        name: 'PT Serif',
        needToLoad: true
    },
    {
        name: 'Roboto',
        needToLoad: true
    },
    {
        name: 'Roboto Mono',
        needToLoad: true
    },
    {
        name: 'Roboto Slab',
        needToLoad: true
    },
    {
        name: 'Times new roman',
        needToLoad: false
    },
    {
        name: 'Verdana',
        needToLoad: false
    }
];