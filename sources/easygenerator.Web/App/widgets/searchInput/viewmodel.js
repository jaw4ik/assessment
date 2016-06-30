﻿import ko from 'knockout';
import _ from 'underscore';
import localizationManager from 'localization/localizationManager';
import guard from 'guard';

export default class {
    constructor() {
        this.value = ko.observable('');
        this.value.subscribe((newValue) => this.inputValue(newValue));
        this.isEditing = ko.observable(false);
        this.hasValue = ko.computed(() => !_.isEmpty(this.value()));
    }

    activate(activationData) {
        guard.throwIfNotObservable(activationData.value, 'Input parameter \'value\' must be an observable. Widget: searchInput.');

        this.inputValue = activationData.value;
        if (!_.isNullOrUndefined(activationData.placeholderKey)) {
            this.placeholder = localizationManager.localize(activationData.placeholderKey);
        }

        this.isEditing(false);
    }

    clear() {
        this.value('');
    }
}