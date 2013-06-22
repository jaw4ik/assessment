define([],
    function () {

        var Publication = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create Publication';
            return {
                id: spec.id,
                title: spec.title,
                objectives: spec.objectives
            };
        };

        return Publication;
    }
);