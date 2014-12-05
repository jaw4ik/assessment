(function () {
    'use strict';

    angular.module('quiz')
           .factory('imagePreviewFactory',  imagePreviewFactory);

    imagePreviewFactory.$inject = ['$rootScope'];

    function imagePreviewFactory($rootScope) {
        var factory = {
            showEventName: 'imagePreview.show',
            showImage: showImage
        };

        return factory;

        function showImage(imageUrl) {
            $rootScope.$emit(factory.showEventName, imageUrl);
        }
    }

}());