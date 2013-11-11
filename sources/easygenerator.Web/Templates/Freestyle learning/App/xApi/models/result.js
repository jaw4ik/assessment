define(['xApi/guard', 'xApi/models/score'],
    function (guard, scoreModel) {
        
        var statement = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create Result';

            guard.throwIfNotNumber(spec.score, 'You should provide score for Result');

            var obj = {};
            obj.score = new scoreModel(spec.score);
            
            return obj;
        };

        return statement;
    }
);