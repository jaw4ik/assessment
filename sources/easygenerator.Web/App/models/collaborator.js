define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var Collaborator = function (spec) {
            
            EntityModel.call(this, spec);
            
            this.email = spec.email;
            this.fullName = spec.fullName;
        };

        return Collaborator;
    }
);