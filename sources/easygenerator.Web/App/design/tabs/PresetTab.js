import ko from 'knockout';
import app from 'durandal/app';

import templateRepository from 'repositories/templateRepository.js';

export let EVENT_PRESET_SELECTED = 'preset:selected';

export default class PresetTab{
    constructor () {
        this.viewUrl = 'design/tabs/PresetTab.html';

        this.isVisible = ko.observable();
        this.collection = ko.observableArray([]);
    }   

    show() {
        this.isVisible(true);
    }

    hide() {
        this.isVisible(false);
    }

    select(preset) {
        if (ko.unwrap(preset.isSelected)) {
            return;
        }

        this.collection().forEach(preset => {
            if (ko.isWriteableObservable(preset.isSelected)) {
                preset.isSelected(false);
            }
        });
        if (ko.isWriteableObservable(preset.isSelected)) {
            preset.isSelected(true);
        }
        app.trigger(EVENT_PRESET_SELECTED, preset);
    }

    activate(templateId, settings) {
        return templateRepository.getById(templateId)
            .then(template => this.collection(Array.isArray(template.presets) ? template.presets.map(p => new Preset(p)) : []))
            .then(() => this.collection().forEach(p => p.isSelected(isMatch(p.settings, settings))));
    }
}

export class Preset {
    constructor(spec) {
        this.title = spec.title;
        this.settings = spec.settings;
        this.isSelected = ko.observable();

        this.mainColor = '#000';
        this.secondaryColor = '#000';
        this.textColor = '#000';
        this.backgroundTexture = null;
        this.backgroundColor = '#fff';

        if (spec && spec.settings && spec.settings.branding) {
            if (Array.isArray(spec.settings.branding.colors)) {
                spec.settings.branding.colors.forEach(c => {
                    if (c.key === '@main-color') {
                        this.mainColor = c.value;
                    }
                    if (c.key === '@text-color') {
                        this.textColor = c.value;
                    }
                    if (c.key === '@secondary-color') {
                        this.secondaryColor = c.value;
                    }
                });
            }
            if (spec.settings.branding.background && spec.settings.branding.background.body ) {
                if (spec.settings.branding.background.body.texture) {
                    this.backgroundTexture = spec.settings.branding.background.body.texture;
                }
                if (spec.settings.branding.background.body.color) {
                    this.backgroundColor = spec.settings.branding.background.body.color;
                }
            }
        }
    }
}

export function isMatch(x, y) {
    if (x === null || x === undefined || y === null || y === undefined) {
        return x === y;
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
        return false;
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
        return x === y;
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
        return x === y;
    }
    if (x === y || x.valueOf() === y.valueOf()) {
        return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
        return false;
    }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
        return false;
    }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
        return false;
    }
    if (!(y instanceof Object)) {
        return false;
    }

    // recursive object equality check
    return Object.keys(x).every(function(i) {
        return isMatch(x[i], y[i]);
    });
}