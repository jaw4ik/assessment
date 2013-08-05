define(['models/entity'],
    function (EntityModel) {

        var Experience = function (spec) {

            var obj = new EntityModel(spec);

            obj.title = spec.title;
            obj.objectives = spec.objectives;
            obj.buildingStatus = spec.buildingStatus;

            return obj;
        };

        return Experience;
    }
);