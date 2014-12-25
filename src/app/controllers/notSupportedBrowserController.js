(function () {
    'use strict';

    angular
        .module('notSupportedBrowser')
        .controller('notSupportedBrowserController', notSupported);

    notSupported.$inject = [
        '$http', '$location'
    ];

    function notSupported($http, $location) {

        var that = this;

        that.submit = function () {
            that.questions.forEach(function (question) {
                question.submit();
            });

            $location.path('/summary');
        };
    }

}());