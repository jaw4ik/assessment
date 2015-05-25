define(['knockout', 'viewmodels/learningContents/content', 'viewmodels/learningContents/components/hotspotParser'],
    function (ko, Content, parser) {
        "use strict";

        var viewModel = function (id, text, type) {
            Content.call(this, id, text, type);

        };

        return viewModel;
    }
);