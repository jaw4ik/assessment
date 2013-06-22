define([],
    function () {

        var Entity = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create an Entity';

            return {
                id: spec.id
            };
        };

        return Entity;
    }
);