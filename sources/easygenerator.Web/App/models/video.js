define(['models/entity'],
    function (Entity) {
        "use strict";

        var video = function (spec) {
            var obj = new Entity(spec);

            obj.title = spec.title;
            obj.vimeoId = spec.vimeoId;
            obj.thumbnailUrl = spec.thumbnailUrl;
            obj.videoIframe = '<iframe src="https://player.vimeo.com/video/' + spec.vimeoId + '?color=ffffff&title=0&byline=0&portrait=0" width="600" height="335" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

            return obj;
        };

        return video;
    }
);