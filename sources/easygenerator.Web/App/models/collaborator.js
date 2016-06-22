define(['models/entity'],
    function (EntityModel) {
        "use strict";

        function Collaborator(spec) {
            EntityModel.call(this, spec);
            this.email = spec.email;
            this.registered = spec.registered;
            this.fullName = spec.fullName;
            this.state = '';
            this.isAccepted = spec.isAccepted;
            this.isAdmin = spec.isAdmin;
        };

        return Collaborator;
    }
);