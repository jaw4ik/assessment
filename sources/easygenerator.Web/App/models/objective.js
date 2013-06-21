define([],
    function () {

        var Objective = function (spec) {
            
            if (typeof spec == typeof undefined) throw 'You should provide a specification to create Objective';
            return {
                id: spec.id,
                title: spec.title,
                image: spec.image
            };
        };

        return Objective;
    }
);