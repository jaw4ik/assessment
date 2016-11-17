import _ from 'underscore';
import abstractValidator from './validators/abstractValidator';
import { facebook } from './validators/facebook.js';
import { yandex } from './validators/yandex.js';
//import { google } from './validators/google.js';

export class Provider {
    constructor() {
        this._registeredValidators = new Map();
    }

    setValidator(validatorName, validator) {
        if((!this._registeredValidators.has(validatorName) && validator instanceof abstractValidator)) {
            this._registeredValidators.set(validatorName, validator);
        }
    }

    async parseLink(url) {
        let microformat = false;
        for (var [key, value] of this._registeredValidators.entries()) {
            microformat = await value.parseLink(url);
            if(!!microformat) {
                break; 
            } else {
                continue;
            }
        }
        return microformat;
    }
}

//??
export function getProvider() {
    let _provider = new Provider();

    _provider.setValidator(facebook.name, new facebook());
    _provider.setValidator(yandex.name, new yandex());
    //_provider.setValidator(google.name, new google());

    return _provider;
}