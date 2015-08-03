(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('HotspotViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function HotspotViewModel(question) {

            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'hotspot';
            };

            that.background = question.background;
            that.spots = question.spots;
            that.isMultiple = question.isMultiple;
            that.marks = [];

            that.addMark = function (mark) {
                if (!that.isMultiple) {
                    that.marks.splice(0, that.marks.length);
                }
                that.marks.push(mark);
            };

            that.removeMark = function (mark) {
                that.marks = _.without(that.marks, _.findWhere(that.marks, mark));
            };

            that.submitAnswer = function () {
                question.answer(that.marks);
            };

        };
    }

}());