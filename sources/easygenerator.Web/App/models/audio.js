define(['models/entity', 'constants'],
    function (Entity) {
        "use strict";

        var Audio = function (spec) {
            var obj = new Entity(spec);
            obj.title = spec.title;
            obj.duration = spec.duration;
            obj.vimeoId = spec.vimeoId;
            obj.source = spec.source;
            obj.status = spec.status;
            obj.available = spec.available;

            return obj;
        };

        return Audio;
    }
);