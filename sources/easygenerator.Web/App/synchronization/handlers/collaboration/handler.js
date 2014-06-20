define(['synchronization/handlers/collaboration/eventHandlers/started', 'synchronization/handlers/collaboration/eventHandlers/disabled', 'synchronization/handlers/collaboration/eventHandlers/finished',
    'synchronization/handlers/collaboration/eventHandlers/collaboratorAdded', 'synchronization/handlers/collaboration/eventHandlers/collaboratorRemoved', 'synchronization/handlers/collaboration/eventHandlers/collaboratorRegistered'],
    function (started, disabled, finished, collaboratorAdded, collaboratorRemoved, collaboratorRegistered) {
        "use strict";

        return {
            started: started,
            disabled: disabled,
            finished: finished,
            collaboratorAdded: collaboratorAdded,
            collaboratorRemoved: collaboratorRemoved,
            collaboratorRegistered: collaboratorRegistered
        }
    }
);