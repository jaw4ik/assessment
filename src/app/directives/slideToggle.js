(function () {

    angular.module('assessment')
        .directive('slideToggle', slideToggle);

    function slideToggle() {
        return {
            restrict: 'A',
            multiElement: true,
            link: function ($scope, element, attr) {
                $(element).hide();
                $scope.$watch(attr.slideToggle, function (value) {
                    var scrollToSelector = $scope.$eval(attr.slideToggleScrollTo),
                        $scrollToElement = $(element).closest(scrollToSelector);

                    $(element).animate({
                        height: value ? 'show' : 'hide'
                    });

                    if ($scrollToElement.length && !value) {
                        var headerHeight = $('.main-header').height() + 5;
                        $('html, body').animate({
                            scrollTop: $scrollToElement.offset().top - headerHeight
                        });
                    }
                });
            }
        };
    }
}());