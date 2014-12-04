(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Hotspot', ['Question', function (Question) {

            return function Hotspot(id, title, background) {
                var that = this;
                Question.call(that, id, title);

                that.background = background;
                that.answer = function (spots) {
                    that.score = 0;
                };
            };

        }]);

}());