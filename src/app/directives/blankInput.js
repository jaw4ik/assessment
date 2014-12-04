(function () {

    angular.module('quiz')
        .directive('blankInput', blank);

    function blank() {
        return {
            restrict: 'C',
            link: function ($scope, element) {
                $(element).wrap('<div class="blankInput-wrapper" />');

                $('<div/>').addClass('highlight').insertAfter(element);
            },
        };
    }

}());