define(['models/entity'],
    function (EntityModel) {
        "use strict";

        var Collaborator = function (spec) {
            
            EntityModel.call(this, spec);
            
            this.email = spec.email;
            this.registered = spec.registered;
            this.fullName = spec.fullName;
        };

        return Collaborator;
    }
);