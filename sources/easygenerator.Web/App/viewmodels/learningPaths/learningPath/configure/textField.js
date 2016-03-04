export default class TextField {
    constructor() {
        this.value = ko.observable('');
        this.originalText = '';
    }

    init(text, callback) {
        this.value = ko.observable(text);
        this.originalText = this.value();
        this.onTextChanged = callback;
    }

    endEdit() {
        let newValue = this.value().trim();
        if ( newValue !== this.originalText) {
            this.value(newValue);
            this.originalText = newValue;

            if (_.isFunction(this.onTextChanged)) {
                this.onTextChanged();
            }
        }    
    }
}