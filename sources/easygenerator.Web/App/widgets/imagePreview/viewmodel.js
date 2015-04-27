define(['durandal/system', 'durandal/composition'], function (system, composition) {
    "use strict";

    var imagePreviewModel = {
        imageUrl: ko.observable(''),
        isVisible: ko.observable(false),
        isLoaded: ko.observable(false),

        openPreviewImage: openPreviewImage,
        closePreview: closePreview,
        activate: activate
    };

    return imagePreviewModel;

    function activate() {
      
    }

    function openPreviewImage(url) {
        showOverlay();
        setPreviewImage(url);
    }

    function setPreviewImage(url) {
        imagePreviewModel.imageUrl(url);
    }

    function showOverlay() {
        imagePreviewModel.isVisible(true);
    }

    function closePreview() {
        hideOverlay();
    }

    function hideOverlay() {
        imagePreviewModel.isVisible(false);
    }
});