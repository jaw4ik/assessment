(function () {

    angular.module('quiz')
        .directive('singleSelectImage', singleSelectImage);

    function singleSelectImage() {
        return {
            restrict: 'E',
            templateUrl: 'views/SingleSelectImage.html'
        };
    }

}());