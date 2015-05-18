define(['models/entity'],
    function (Entity) {
        "use strict";

        var video = function (spec) {
            var obj = new Entity(spec);

            obj.title = spec.title;
            obj.vimeoId = spec.vimeoId;
            obj.status = spec.status;
            obj.progress = spec.progress;

            return obj;
        };

        return video;
    }
);