define(['viewmodels/learningContents/content',
        'viewmodels/learningContents/hotspotOnAnImage'],
    function (content, hotspot) {
        "use strict";

        return {
            content: content,
            hotspot: hotspot
        };

    }
);