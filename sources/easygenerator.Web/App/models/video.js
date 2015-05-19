define(['models/entity', 'constants'],
    function (Entity, constants) {
        "use strict";

        var video = function (spec) {
            var obj = new Entity(spec);
            obj.title = spec.title;
            obj.vimeoId = spec.vimeoId;
            obj.status = spec.status || constants.messages.storage.video.statuses.loaded;
            obj.progress = spec.progress;

            return obj;
        };

        return video;
    }
);