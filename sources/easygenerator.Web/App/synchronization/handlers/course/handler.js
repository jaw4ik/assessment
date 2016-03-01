define(['synchronization/handlers/course/eventHandlers/deleted', 'synchronization/handlers/course/eventHandlers/introductionContentUpdated',
    'synchronization/handlers/course/eventHandlers/sectionRelated', 'synchronization/handlers/course/eventHandlers/sectionsReordered',
'synchronization/handlers/course/eventHandlers/sectionsUnrelated', 'synchronization/handlers/course/eventHandlers/published',
'synchronization/handlers/course/eventHandlers/templateUpdated', 'synchronization/handlers/course/eventHandlers/titleUpdated',
'synchronization/handlers/course/eventHandlers/sectionsReplaced', 'synchronization/handlers/course/eventHandlers/stateChanged'],
    function (deleted, introductionContentUpdated, sectionRelated, sectionsReordered, sectionsUnrelated, published, templateUpdated, titleUpdated, sectionsReplaced, stateChanged) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            introductionContentUpdated: introductionContentUpdated,
            templateUpdated: templateUpdated,
            sectionsReordered: sectionsReordered,
            published: published,
            deleted: deleted,
            sectionRelated: sectionRelated,
            sectionsUnrelated: sectionsUnrelated,
            sectionsReplaced: sectionsReplaced,
            stateChanged: stateChanged
        };

    });