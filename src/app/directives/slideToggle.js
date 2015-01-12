(function () {

    angular.module('quiz')
        .directive('slideToggle', slideToggle);

    function slideToggle() {
        return {
            restrict: 'A',
            multiElement: true,
            link: function ($scope, element, attr) {
                $(element).hide();
                $scope.$watch(attr.slideToggle, function (value) {
                    $(element).animate({
                        height: value ? 'show' : 'hide'
                    });
                });
            }
        };
    }
}());