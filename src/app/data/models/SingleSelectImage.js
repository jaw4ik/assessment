(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectImage', ['Question', function (Question) {
        
            return function SingleSelectImage(id, title, answers) {
                var that = this;
                Question.call(that, id, title);
                that.options = answers;
                that.answer = function (image) {
                    that.options.forEach(function (option) {
                        if (option.image === image && option.isCorrect) {
                            that.score = 100;
                        }
                    });
                };
            };

        }]);

}());