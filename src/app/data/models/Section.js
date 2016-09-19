(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('Section', factory);

    function factory() {
        return function Section(id, title, questions) {
            var that = this;

            that.id = id;
            that.title = title;
            that.questions = questions || [];

            that.getResult = function () {
                var questionsThatAffectTheProgress = 0;
                var result = _.reduce(that.questions, function (memo, question) {
                    if(!question.affectProgress){
                        return memo;
                    }
                    questionsThatAffectTheProgress++;
                    if (question.score == 100) {
                        return memo + question.score;
                    }
                    return memo;
                }, 0);
                if(questionsThatAffectTheProgress === 0){
                    return 100;
                }
                return questionsThatAffectTheProgress === 0 ? 0 : Math.floor(result / questionsThatAffectTheProgress);
            };
        };
    }

}());