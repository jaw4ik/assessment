define([], function () {
    "use strict";
    return function (id, image) {
        var self = this;
        self.id = id;
        self.image = ko.observable(image);
        self.hasImage = ko.computed(function () {
            return !_.isNullOrUndefined(self.image());
        });
    }
})