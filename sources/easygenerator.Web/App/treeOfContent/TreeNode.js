define([], function () {
    return function (id, title, url) {
        this.id = id;
        this.title = ko.observable(title);
        this.url = url;
    };
})