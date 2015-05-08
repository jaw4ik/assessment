define([],
    function () {
        "use strict";
        
        function Entity (spec) {
            if (typeof spec == typeof undefined) {
                throw 'You should provide a specification to create an Entity';
            }

            this.id = spec.id;
            this.createdOn = spec.createdOn;
            this.modifiedOn = spec.modifiedOn;
        }

        return Entity;
    }
);