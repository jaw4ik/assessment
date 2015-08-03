(function () {

    angular.module('assessment')
        .directive('singleSelectImage', singleSelectImage);

    function singleSelectImage() {
        return {
            controller: ['imagePreviewFactory', singleSelectImageController],
            controllerAs: 'singleSelectImage'
        };
    }

    function singleSelectImageController(imagePreviewFactory) {
        var that = this;

        that.openPreviewImage = openPreviewImage;

        function openPreviewImage(imageUrl) {
            imagePreviewFactory.showImage(imageUrl);
        }
    }

}());