(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('FillInTheBlanks', ['Question', function (Question) {

            return function FillInTheBlanks(id, title, groups) {
                var that = this;
                Question.call(that, id, title);

                that.groups = groups;

                that.answer = function (answers) {
                    var correct = 0;
                    _.each(that.groups, function (group) {
                        if (_.find(group.answers, function (answer) {
                            return answer.isCorrect && answers[group.id] === answer.text;
                        })) {
                            correct++;
                        }
                    });                    

                    that.score = correct == that.groups.length ? 100 : 0;
                };
            };

        }]);

}());