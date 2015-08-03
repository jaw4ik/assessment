(function () {

    angular.module('assessment')
        .directive('textMatching', textMatching);

    function textMatching() {
        return {
            link: function ($scope, element) {
                var clone;

                $scope.$watch(function () {
                    return element.children().length;
                }, function () {
                    $scope.$evalAsync(function () {
                        clone = element
                            .clone()
                            .css({
                                left: '-9999px',
                                top: '-9999px',
                                position: 'absolute',
                                visibility: 'hidden',
                                width: '100%'
                            })
                            .insertAfter(element);

                        handler();
                    });
                });

                var handler = function () {

                    if (element && clone) {
                        var maxHeight = 0;
                        clone.find('.text-matching-table').each(function () {
                            if ($(this).outerHeight() > maxHeight) {
                                maxHeight = $(this).outerHeight();
                            }
                        });
                        element.find('.text-matching-table').each(function () {
                            $(this).height(maxHeight);
                        });
                    }

                };

                $(window).on('resize', _.debounce(handler));

            }
        };
    }

}());