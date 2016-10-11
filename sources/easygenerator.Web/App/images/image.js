export default class Image {
    constructor(spec) {
        this.id = spec.id;
        this.title = spec.title;
        this.url = spec.url;
        this.isDeleteConfirmationShown = ko.observable(false);
        this.isDeleting = ko.observable(false);
    }
}