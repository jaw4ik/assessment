define([],
    function () {

        var template = function (spec) {

            var obj = {};

            obj.name = spec.name;
            obj.id = spec.id;
            obj.image = spec.image;

            return obj;
        };

        return template;
    }
);