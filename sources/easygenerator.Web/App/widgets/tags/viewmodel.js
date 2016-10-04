import ko from 'knockout';
import _ from 'underscore';
import localizationManager from 'localization/localizationManager';
import guard from 'guard';
import notify from 'notify';

const ENTER_KEY_CODE = 13;
const SPACE_KEY_CODE = 32;
const COMMA_KEY_CODE = 44;
const SEMICOLON_KEY_CODE = 59;
const BACKSPACE_KEY_CODE = 8;

const DEFAULT_PATTERN = /.+/;

class Tag {
    constructor(text, removeHandler, updateHandler, validationPattern) {
        this.text = ko.observable(text);
        this.validateText = (data, event) => {
            let key = event.keyCode ? event.keyCode : event.which;
            return key !== ENTER_KEY_CODE && key !== SPACE_KEY_CODE && key !== COMMA_KEY_CODE && key !== SEMICOLON_KEY_CODE;
        };
        this.textUpdated = () => {
            updateHandler();
            return true;
        };
        this.isSelected = ko.observable(false);
        this.isValid = ko.computed(() => validationPattern.test(this.text()));
        this.remove = () => removeHandler(this);
    }
}

export default class {
    constructor() {
        this.collection = ko.observableArray([]);
        this.collection.subscribe(() => this.updateInputCollection());
        this.mainInputValue = ko.observable('');
        this.mainInputValue.subscribe(this.mainInputUpdated.bind(this));
        this.mainInputFocus = ko.observable(false);
        this.mainInputVisibility = ko.computed(() => !_.some(this.collection(), item => item.isSelected()));
        this.placeholderVisibility = ko.computed(() => this.mainInputValue().length === 0 && this.collection().length === 0);
        this.temporaryTagIncluded = false;

        this.updateInputCollection = this.updateInputCollection.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.createTag = this.createTag.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
        this.backspaceHandler = this.backspaceHandler.bind(this);
        this.unselectAllTags = this.unselectAllTags.bind(this);
        this.valuePasted = this.valuePasted.bind(this);
    }

    activate(activationData) {
        guard.throwIfNotObservableArray(activationData.collection, 
            'Input parameter \'collection\' must be an observable array. Widget: tags.');

        this.inputCollection = activationData.collection;
        this.autofocus = activationData.autofocus;
        this.disabled = activationData.disabled;
        this.validationPattern = activationData.validationPattern || DEFAULT_PATTERN;
        this.valid = ko.isObservable(activationData.valid) ? activationData.valid : ko.observable(true);
        this.isFileLoading = ko.observable(false);

        if (!_.isNullOrUndefined(activationData.headerKey)) {
            this.header = localizationManager.localize(activationData.headerKey);
        }

        if (!_.isNullOrUndefined(activationData.placeholderKey)) {
            this.placeholder = localizationManager.localize(activationData.placeholderKey);
        }

        this.collection(_.map(this.inputCollection(), text => this.createTag(text)));
    }
    
    mainInputUpdated(newValue) {
        if (this.validationPattern.test(newValue)) {
            if (this.temporaryTagIncluded) {
                this.inputCollection.pop();
            }

            this.inputCollection.push(newValue);
            this.temporaryTagIncluded = true;
            this.valid(true);
        } else if (this.temporaryTagIncluded) {
            this.inputCollection.pop();
            this.temporaryTagIncluded = false;
        }
    }

    updateInputCollection() {
        this.inputCollection(_.chain(this.collection())
            .filter(item => item.isValid())
            .map(item => item.text())
            .value());

        this.temporaryTagIncluded = false;
        this.mainInputUpdated(this.mainInputValue());
    }

    removeTag(tag) {
        this.collection.remove(tag);
        this.mainInputFocus(true);
    }

    createTag(initialText) {
        return new Tag(initialText, this.removeTag, this.updateInputCollection, this.validationPattern);
    }

    unselectAllTags() {
        _.each(this.collection(), item => item.isSelected(false));
    }

    parseDataToCollection(data) {
        let prevCollectionLength = this.collection().length,
            tags = data.replace(/(?:\r\n|\r|\n)/g, ' ').split(/,|;| /);

        _.chain(tags)
            .filter(tagText => !_.isEmpty(tagText))
            .each(tagText => {
                let tag = this.createTag(tagText);
                if (tag.isValid()) {
                    this.collection.push(tag);
                }
            });

        if (this.collection().length === prevCollectionLength) {
            notify.error(localizationManager.localize('noValidEmailsError'));
        }
    }

    valuePasted(data, event) {
        let clipboard = (event.originalEvent || event).clipboardData;
        if (_.isNullOrUndefined(clipboard)) {
            return true;
        }

        let pastedData = clipboard.getData('text/plain');
        if (_.isEmpty(pastedData)) {
            return true;
        }
        this.parseDataToCollection(pastedData);
        return false;
    }
    
    importTags(file) {
        try {
            if (!file.name.toLowerCase().match(/\.csv$/)) {
                notify.error(localizationManager.localize('fileFormatNotSupportedUseCsv'));
                return;
            }

            let reader = new FileReader();
            let viewModel = this;

            reader.onload = () => {
                viewModel.parseDataToCollection(reader.result);
                viewModel.isFileLoading(false);
            }
            reader.onerror = () => {
                notify.error(localizationManager.localize('fileUploadError'));
                viewModel.isFileLoading(false);
            }

            this.isFileLoading(true);
            reader.readAsText(file);
        } catch (e) {
            notify.error(localizationManager.localize('fileUploadError') + ' ' + e);
        }
    }

    inputChanged(data, event) {
        let key = event.keyCode ? event.keyCode : event.which;
        if (key !== ENTER_KEY_CODE && key !== SPACE_KEY_CODE && key !== COMMA_KEY_CODE && key !== SEMICOLON_KEY_CODE) {
            return true;
        }

        if (!_.isEmpty(this.mainInputValue())) {
            this.collection.push(this.createTag(this.mainInputValue()));
            this.mainInputValue('');
        }
         
        return false;
    }

    backspaceHandler(data, event) {
        let lastTimeStamp = this.lastEventTimeStamp;
        this.lastEventTimeStamp = event.timeStamp;

        if (event.keyCode !== BACKSPACE_KEY_CODE || (lastTimeStamp && event.timeStamp - lastTimeStamp < 100)) {
            this.unselectAllTags();
            return true;
        }

        if (this.mainInputValue().length > 0) {
            return true;
        }

        let lastTag = _.last(this.collection());
        if (_.isNullOrUndefined(lastTag)) {
            return true;
        }

        if (lastTag.isSelected()) {
            lastTag.remove();
        } else {
            lastTag.isSelected(true);
        }

        return true;
    }
}