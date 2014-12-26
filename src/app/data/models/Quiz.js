(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Quiz', factory);

    function factory() {
        return function Quiz(title, questions) {
            var that = this;

            that.title = title;
            that.questions = questions || [];

            that.getResult = function () {
				if(that.questions.length === 0){
					return 0;
				}
			
                var correct = 0;
                that.questions.forEach(function (question) {
                    correct += question.score;
                });
                return Math.floor(correct / that.questions.length);
            };

        };
    }

}());