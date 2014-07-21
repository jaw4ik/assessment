define([], function () {
    "use strict";
    return function (id, image) {
        var self = this;
        self.id = ko.observable(id);
        self.image = ko.observable(image);
        self.isLoading = ko.observable(true);
        self.isImageUploading = ko.observable(false);
        self.hasImage = ko.computed(function () {
            return !_.isNullOrUndefined(self.image());
        });
    }
})