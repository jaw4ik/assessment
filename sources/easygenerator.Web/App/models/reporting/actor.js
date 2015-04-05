define(['guard'], function (guard) {
    "use strict";

    var Actor = function (spec) {
        guard.throwIfNotAnObject(spec, 'You should provide specification for the actor');

        this.name = spec.name;
        this.email = spec.mbox.replace('mailto:', '');
    };

    return Actor;
});