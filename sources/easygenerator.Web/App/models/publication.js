define(['models/entity'],
    function (EntityModel) {

        var Publication = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.objectives = spec.objectives;

            return obj;
        };

        return Publication;
    }
);