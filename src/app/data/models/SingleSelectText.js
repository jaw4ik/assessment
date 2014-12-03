(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectText', ['Question', function (Question) {

            return function SingleSelectText(id, title, options) {
                var that = this;
                Question.call(that, id, title);

                that.options = options;
                that.answer = function (text) {
                    that.score = 0;
                    that.options.forEach(function (option) {
                        if (option.text === text && option.isCorrect) {
                            that.score = 100;
                        }
                    });
                };
            };

        }]);

}());