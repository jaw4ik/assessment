(function () {

    angular.module('quiz')
        .directive('singleSelectImage', singleSelectImage);

    function singleSelectImage() {
        return {
            restrict: 'E',
            templateUrl: 'views/SingleSelectImage.html',
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