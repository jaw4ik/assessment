define(['synchronization/handlers/collaboration/eventHandlers/started', 'synchronization/handlers/collaboration/eventHandlers/finished',
    'synchronization/handlers/collaboration/eventHandlers/collaboratorAdded', 'synchronization/handlers/collaboration/eventHandlers/collaboratorRemoved',
    'synchronization/handlers/collaboration/eventHandlers/collaboratorRegistered', 'synchronization/handlers/collaboration/eventHandlers/inviteCreated',
    'synchronization/handlers/collaboration/eventHandlers/inviteRemoved', 'synchronization/handlers/collaboration/eventHandlers/inviteAccepted',
    'synchronization/handlers/collaboration/eventHandlers/inviteCourseTitleUpdated'],
    function (started, finished, collaboratorAdded, collaboratorRemoved, collaboratorRegistered, inviteCreated, inviteRemoved, inviteAccepted, inviteCourseTitleUpdated) {
        "use strict";

        return {
            started: started,
            finished: finished,
            collaboratorAdded: collaboratorAdded,
            collaboratorRemoved: collaboratorRemoved,
            collaboratorRegistered: collaboratorRegistered,
            inviteCreated: inviteCreated,
            inviteRemoved: inviteRemoved,
            inviteAccepted: inviteAccepted,
            inviteCourseTitleUpdated: inviteCourseTitleUpdated
        }
    }
);