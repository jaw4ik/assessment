(function () {

    angular.module('quiz')
        .directive('blankInput', blank);

    function blank() {
        return {
            restrict: 'C',
            transclude: 'element',
            replace: true,
            scope: true,
            controller: function ($scope, $element) {
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
            },
            link: function ($scope, $element) {
                $element
                    .removeClass('blankInput')
                    .on('change', 'input', function () {                    
                        $scope.group.answer = $(this).val();
                        $scope.$apply();
                    });
            },
            template: '<div class="input-wrapper">' +
                        '<input type="text" />' +
                        '<div class="highlight"></div>' +
                      '</div>'
        };
    }

}());