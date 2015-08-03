(function () {

    angular.module('assessment')
        .directive('blankInput', blank);

    function blank() {
        return {
            restrict: 'C',
            transclude: 'element',
            replace: true,
            scope: true,
            controller: ['$scope', '$element', function ($scope, $element) {
                var
                    attr = $element.attr('data-group-id'),
                    question = $scope.question,
                    group = _.find(question.groups, function (g) {
                        return g.groupId === attr;
                    });

                if (!group) {
                    throw 'Can\'t find answer group with id' + attr;
                }

                $scope.group = group;
            }],
            link: function ($scope, $element) {
                $element
                    .removeClass('blankInput')
                    .on('change', 'input', function () {
                        $scope.group.answer = $(this).val();
                        $scope.$apply();
                    });
                $('.highlight', $element).on('click', function () {
                    $('input', $element).focus();
                });
            },
            template: '<div class="input-wrapper">' +
                        '<input type="text" />' +
                        '<div class="highlight"></div>' +
                      '</div>'
        };
    }

}());