define([], function () {
    "use strict";
    return function (id, image) {
        this.id = id;
        this.image = ko.observable(image);
    }
})