define(['models/entity', 'constants'],
    function (Entity, constants) {
        "use strict";

        var video = function (spec) {

            var obj = new Entity(spec);
            obj.title = spec.title;
            obj.vimeoId = spec.vimeoId;
            obj.thumbnailUrl = spec.thumbnailUrl;
            obj.progress = spec.progress;
            obj.status = spec.status || constants.storage.video.statuses.loaded;
            obj.associatedLearningContentId = spec.associatedLearningContentId || null;
              
            return obj;
        };

        return video;
    }
);