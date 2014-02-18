﻿define(['../guard'],
    function (guard) {

        var result = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create Result';

            var obj = {};

            if (typeof spec.score != typeof undefined) {
                obj.score = spec.score;
            }

            if (typeof spec.duration != typeof undefined) {
                guard.throwIfNotISODuration(spec.duration, 'You should provide duration in correct ISO duration format.');
                obj.duration = spec.duration;
            }

            if (typeof spec.response != typeof undefined) {
                obj.response = spec.response;
            }

            return obj;
        };

        return result;
    }
);