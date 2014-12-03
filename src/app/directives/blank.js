(function () {

    angular.module('quiz')
        .directive('blank', blank);

    function blank() {
        return {
            link: function ($scope) {
                var
                    answer = $scope.answer,
                    source
                ;
                $scope.$watch(function () {
                    source = $('[data-group-id=' + answer.groupId + ']');
                    return $(source).length;
                }, function () {
                    $scope.$evalAsync(function () {

                        var
                            handler = function () {
                                var value = source.val();
                                if (value) {
                                    answer.text = value.trim();
                                }
                                $scope.$apply();
                            }
                        ;

                        source
                            .val('')
                            .on('blur change', handler)
                        ;

                    });
                });

            }
        };
    }

}());