define(['models/entity'],
    function (Entity) {
        "use strict";

        var video = function (spec) {
            var obj = new Entity(spec);

            obj.title = spec.title;
            obj.vimeoId = spec.vimeoId;
            obj.thumbnailUrl = spec.thumbnailUrl;
            obj.videoIframe = spec.videoIframe;
            obj.size = spec.size;

            return obj;
        };

        return video;
    }
);