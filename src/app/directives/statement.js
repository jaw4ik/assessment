(function () {

    angular.module('quiz')
        .directive('statement', statement);

    function statement() {
        return {
            templateUrl: 'views/statement.html'
        };
    }

    angular.module('quiz')
      .directive('statementItem', statementItem);

    function statementItem() {
        return {
            restrict: 'A',
            scope: {
                question: '=',
                statement: '='
            },
            templateUrl: 'views/statementItem.html',
            link: link
        };
    }

    function link(scope, element) {
        var $element = $(element);
        var $statementItem = $('.statement-item', $element);
        $('.statement-button.true', $element).hover(function () {
            $statementItem.removeClass('hover-false').addClass('hover-true');
        }, function () {
            $statementItem.removeClass('hover-true');
        });

        $('.statement-button.false', $element).hover(function () {
            $statementItem.removeClass('hover-true').addClass('hover-false');
        }, function () {
            $statementItem.removeClass('hover-false');
        });
    }

}());