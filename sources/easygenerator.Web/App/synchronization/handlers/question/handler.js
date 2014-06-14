define(['synchronization/handlers/question/eventHandlers/titleUpdated', 'synchronization/handlers/question/eventHandlers/contentUpdated'],
    function (titleUpdated, contentUpdated) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            contentUpdated: contentUpdated
        };

    });