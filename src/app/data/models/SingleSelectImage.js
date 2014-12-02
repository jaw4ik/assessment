(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectImage', ['Question', function (Question) {

            return function SingleSelectImage(id, title) {
                var that = this;
                Question.call(that, id, title);
                
                that.answer = function () {

                };
            };

        }]);

}());