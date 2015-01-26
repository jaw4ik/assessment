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
                    var collapseTo = $scope.$eval(attr.slideToggleCollapseTo),
                        $collapseToElement = $(element).closest(collapseTo);

                    $(element).animate({
                        height: value ? 'show' : 'hide'
                    });

                    if ($collapseToElement.length) {
                        $('html, body').animate({
                            scrollTop: $collapseToElement.offset().top - 75
                        });
                    }
                });
            }
        };
    }
}());