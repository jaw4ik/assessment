define(['synchronization/handlers/course/eventHandlers/deleted', 'synchronization/handlers/course/eventHandlers/introductionContentUpdated',
    'synchronization/handlers/course/eventHandlers/sectionRelated', 'synchronization/handlers/course/eventHandlers/sectionsReordered',
'synchronization/handlers/course/eventHandlers/sectionsUnrelated', 'synchronization/handlers/course/eventHandlers/published',
'synchronization/handlers/course/eventHandlers/publishedForSale', 'synchronization/handlers/course/eventHandlers/processedByCoggno',
'synchronization/handlers/course/eventHandlers/templateUpdated', 'synchronization/handlers/course/eventHandlers/titleUpdated',
'synchronization/handlers/course/eventHandlers/sectionsReplaced', 'synchronization/handlers/course/eventHandlers/stateChanged',
'synchronization/handlers/course/eventHandlers/ownershipUpdated', 'synchronization/handlers/course/eventHandlers/modified'],
    function (deleted, introductionContentUpdated, sectionRelated, sectionsReordered, sectionsUnrelated, published, publishedForSale, processedByCoggno, templateUpdated, titleUpdated, sectionsReplaced,
        stateChanged, ownershipUpdated, modified) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            introductionContentUpdated: introductionContentUpdated,
            templateUpdated: templateUpdated,
            sectionsReordered: sectionsReordered,
            published: published,
            publishedForSale: publishedForSale,
            processedByCoggno: processedByCoggno,
            deleted: deleted,
            sectionRelated: sectionRelated,
            sectionsUnrelated: sectionsUnrelated,
            sectionsReplaced: sectionsReplaced,
            stateChanged: stateChanged,
            ownershipUpdated: ownershipUpdated,
            modified: modified
        };

    });