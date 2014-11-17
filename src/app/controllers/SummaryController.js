(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('SummaryController', SummaryController);

    function SummaryController() {
        var a = 1;
        return a++;
    }

}());