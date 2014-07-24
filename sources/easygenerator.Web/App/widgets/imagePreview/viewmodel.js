define(['durandal/system', 'durandal/composition'], function (system, composition) {
    "use strict";

    var imagePreviewModel = {
        duration: 400,
        imageUrl: ko.observable(''),
        imageMaxWidth: ko.observable(1000),
        imageMaxHeight: ko.observable(1000),
        isVisible: ko.observable(false),
        isLoaded: ko.observable(false),

        openPreviewImage: openPreviewImage,
        closePreview: closePreview,
        activate: activate,
        deactivate: deactivate
    };

    return imagePreviewModel;

    function activate() {
        imagePreviewModel.windowResizeHandler = $(window).on('resize', function () {
            if (imagePreviewModel.isVisible()) {
                updatePreviewImageSize();
            }
        });

        imagePreviewModel.orientationChange = $(window).on("orientationchange", function () {
            if (imagePreviewModel.isVisible()) {
                updatePreviewImageSize();
            }
        });

        
    }

    function deactivate() {
        $(window).unbind('resize', imagePreviewModel.windowResizeHandler);
        $(window).unbind('orientationchange', imagePreviewModel.orientationChange);
    }

    function openPreviewImage(url) {
        showOverlay();
        setPreviewImage(url);
    }

    function setPreviewImage(url) {
        var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var maxSize = browserWidth > browserHeight ? browserWidth : browserHeight;
        imagePreviewModel.imageUrl(''); //to avoid blink of switching image
        imagePreviewModel.isLoaded(false);
        var imageUrl = url + '?height=' + maxSize + '&amp;width=' + maxSize;
        var image = new Image();
        image.src = imageUrl;
        image.onload = function () {
            imagePreviewModel.imageUrl(imageUrl);
            updatePreviewImageSize();
            imagePreviewModel.isLoaded(true);
        }
    }

    function updatePreviewImageSize() {
        var browserWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 46,
            browserHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 46;
        imagePreviewModel.imageMaxWidth(browserWidth - 46);
        imagePreviewModel.imageMaxHeight(browserHeight - 46);
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