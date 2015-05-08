define([], function () {
    "use strict";
    return function (id, image) {
        var self = this;
        self.id = ko.observable(id);
        self.image = ko.observable(image);
        self.isEditing = ko.observable(false);
        self.isDeleted = false;
        self.isProcessing = ko.observable(true);
        self.isImageLoading = ko.observable(false);
        self.hasImage = ko.computed(function () {
            return !_.isNullOrUndefined(self.image());
        });
    }
})