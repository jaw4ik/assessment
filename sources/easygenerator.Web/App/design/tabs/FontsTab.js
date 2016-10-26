import ko from 'knockout';
import _ from 'underscore';

import fonts from 'fonts';
import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';

import ContentStyles from './fonts/contentStyles';
import GeneralStyles from './fonts/generalStyles';

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
        
        this.customFonts = [];
    }

    expand(section) {
        _.each(this.contentStyles.elements(), (element)=>{
            element.isVisible(false);
        });
        [ this.contentStyles, this.generalStyles ].forEach(item => item.expanded(section === item));
    }

    activate(settings, defaults, allowEdit){
        let that = this;

        _.each(this.customFonts, (font) => {
            if(!_.contains(fontFamilies, font)){
                fontFamilies.push(font);
            }
        });

        return new Promise(resolve => {
            this.generalStyles.activate(settings, defaults, allowEdit);
            this.contentStyles.activate(settings, defaults, allowEdit);
            resolve();
        }).then(() => {
            let familiesToLoad = _.map(_.filter(fontFamilies, fontFamily => { return fontFamily.needToLoad }), font => {
                return {"family": font.name, "place": font.place};
            });
            return fonts.load(familiesToLoad);
        }).then(() => {
            that.isLoadingSettings(false);
            that.available = userContext.hasPlusAccess();
        });
    }
}

var fontFamilies = [
    {
        name: 'Arial',
        needToLoad: false,
        place: 'none'
    },
    {
        name: 'Bad Script',
        needToLoad: true,
        place: 'google'
    },
    {
        name: 'Dyslexie',
        needToLoad: true,
        place: 'custom'
    },
    {
        name: 'Ledger',
        needToLoad: true,
        place: 'google'
    },
    {
        name: 'Open Sans',
        needToLoad: false,
        place: 'google'
    },
    {
        name: 'PT Sans',
        needToLoad: true,
        place: 'google'
    },
    {
        name: 'PT Serif',
        needToLoad: true,
        place: 'google'
    },
    {
        name: 'Roboto',
        needToLoad: true,
        place: 'google'
    },
    {
        name: 'Roboto Mono',
        needToLoad: true,
        place: 'google'
    },
    {
        name: 'Roboto Slab',
        needToLoad: true,
        place: 'google'
    },
    {
        name: 'Times new roman',
        needToLoad: false,
        place: 'none'
    },
    {
        name: 'Verdana',
        needToLoad: false,
        place: 'none'
    }
];

export { fontFamilies };