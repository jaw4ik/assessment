define(['synchronization/handlers/question/titleUpdated', 'synchronization/handlers/question/contentUpdated'],
    function (titleUpdated, contentUpdated) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            contentUpdated: contentUpdated
        };

    });