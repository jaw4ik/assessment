import ko from 'knockout';

class PreviewDocumentDialog {
    constructor() {
        this.isShown = ko.observable(false);
        this.type = '';
        this.title = '';
        this.embedCode = '';
    }
    show(title = '', embedCode = '', type = null) {
        this.type = type;
        this.title = title;
        this.embedCode = embedCode;
        this.isShown(true);
    }
    hide() {
        this.isShown(false);
    }
}

export default new PreviewDocumentDialog();
