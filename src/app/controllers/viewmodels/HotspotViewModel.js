(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('HotspotViewModel', ['QuestionViewModel', function (QuestionViewModel) {

            return function HotspotViewModel(question) {

                QuestionViewModel.call(this, question);

                var that = this;
                that.getType = function () {
                    return 'hotspot';
                };                

                that.background = question.background;

                that.submit = function () {
                    question.answer(null);
                };

            };

        }]);

}());