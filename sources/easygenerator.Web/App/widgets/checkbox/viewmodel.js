import ko from 'knockout';
import _ from 'underscore';
import guard from 'guard';
import localizationManager from 'localization/localizationManager';

export default class {
    constructor() {
        this.text = '';
        this.value = ko.observable(false);
    }

    activate(activationData) {
        guard.throwIfNotDefined(activationData.value, 'Input parameter \'value\' must be defined. Widget: checkbox.');
        this.value(ko.unwrap(activationData.value));

        if (_.isString(activationData.text)) {
            this.text = activationData.text;
        } else if (_.isString(activationData.key)) {
            this.text = localizationManager.localize(activationData.key);
        }

        if (_.isFunction(activationData.valueChanged)) {
            this.valueChanged = activationData.valueChanged;
        }
    }

    changeValue() {
        this.value(!this.value());
        
        if (_.isFunction(this.valueChanged)) {
            this.valueChanged(this.value());
        }
    }
}