import deleted from 'synchronization/handlers/course/eventHandlers/deleted';
import introductionContentUpdated from 'synchronization/handlers/course/eventHandlers/introductionContentUpdated';
import sectionRelated from 'synchronization/handlers/course/eventHandlers/sectionRelated';
import sectionsReordered from 'synchronization/handlers/course/eventHandlers/sectionsReordered';
import sectionsUnrelated from 'synchronization/handlers/course/eventHandlers/sectionsUnrelated';
import published from 'synchronization/handlers/course/eventHandlers/published';
import publishedForSale from 'synchronization/handlers/course/eventHandlers/publishedForSale';
import processedByCoggno from 'synchronization/handlers/course/eventHandlers/processedByCoggno';
import templateUpdated from 'synchronization/handlers/course/eventHandlers/templateUpdated';
import titleUpdated from 'synchronization/handlers/course/eventHandlers/titleUpdated';
import sectionsReplaced from 'synchronization/handlers/course/eventHandlers/sectionsReplaced';
import stateChanged from 'synchronization/handlers/course/eventHandlers/stateChanged';
import ownershipUpdated from 'synchronization/handlers/course/eventHandlers/ownershipUpdated';
import modified from 'synchronization/handlers/course/eventHandlers/modified';
import accessGranted from 'synchronization/handlers/course/eventHandlers/accessGranted';
import accessRemoved from 'synchronization/handlers/course/eventHandlers/accessRemoved';
import invitationSended from 'synchronization/handlers/course/eventHandlers/invitationSended';

export default {
    titleUpdated,
    introductionContentUpdated,
    templateUpdated,
    sectionsReordered,
    published,
    publishedForSale,
    processedByCoggno,
    deleted,
    sectionRelated,
    sectionsUnrelated,
    sectionsReplaced,
    stateChanged,
    ownershipUpdated,
    modified,
    accessGranted,
    accessRemoved,
    invitationSended
};