(function () {

    angular.module('quiz')
        .directive('statement', statement);

    function statement() {
        return {
            restrict: 'E',
            templateUrl: 'views/statement.html'
        };
    }

    angular.module('quiz')
      .directive('statementItem', statementItem);

    function statementItem() {
        return {
            restrict: 'A',
            templateUrl: 'views/statementItem.html',
            link: link
        };
    }

    function link(scope, element, attrs) {
        var $element = $(element);
        $('.statement-button.true', $element).hover(function () {
            $element.removeClass('false').addClass("true");
        }, function () {
            $element.removeClass("true");
        });

        $('.statement-button.false', $element).hover(function () {
            $element.removeClass('true').addClass("false");
        }, function () {
            $element.removeClass("false");
        });
    }

}());