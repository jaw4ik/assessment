import ko from 'knockout';
import _ from 'underscore';
import localizationManager from 'localization/localizationManager';
import guard from 'guard';

export default class {
    constructor() {
        this.expanded = ko.observable(false);
        this.counterEnabled = ko.observable(false);

        this.selectValue = this.selectValue.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
        this.collapse = this.collapse.bind(this);
    }

    activate(activationData) {
        guard.throwIfNotAnObject(ko.unwrap(activationData.options), 'Input parameter \'options\' must be an array or object. Widget: selectPopover.');
        guard.throwIfNotObservable(activationData.value, 'Input parameter \'value\' must be an observable. Widget: selectPopover.');

        let localize = _.isUndefined(activationData.localize) ? true : activationData.localize;
        let counter = _.isUndefined(activationData.enableCounter) ? false : activationData.enableCounter;
        this.callback = activationData.callback || (() => {});
        this.enabled = _.isUndefined(activationData.enabled) ? true : activationData.enabled;

        this.counterEnabled(counter);

        this.options = _.chain(ko.unwrap(activationData.options))
            .toArray()
            .map(item => counter ?
                ({
                    key: item.name,
                    count: item.count,
                    text: localize ? localizationManager.localize(item.name) : item.name
                }) :
                ({
                    key: item,
                    text: localize ? localizationManager.localize(item) : item
                }))
            .value();
        this.value = activationData.value;

        let firstOption = _.first(this.options);
        if (_.isEmpty(this.value()) && _.isObject(firstOption)) {
            this.value(firstOption.key);
        }

        this.selectedText = ko.computed(() => {
            let selectedOption = _.find(this.options, option => option.key === this.value());
            return selectedOption ? selectedOption.text : '';
        });
    }

    selectValue(newValue) {
        this.value(newValue);
        this.collapse();
        this.callback();
    }

    toggleExpand() {
        this.expanded(!this.expanded());
    }

    collapse() {
        this.expanded(false);
    }
}
