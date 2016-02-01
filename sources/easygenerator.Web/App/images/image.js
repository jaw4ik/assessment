export default class Image {
    constructor(spec) {
        this.id = spec.id;
        this.title = spec.title;
        this.url = spec.url;
        this.thumbnailUrl = spec.url + '?width=200&height=150';
        this.isDeleteConfirmationShown = ko.observable(false);
        this.isDeleting = ko.observable(false);
    }
}