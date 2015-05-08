define([
    'synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotCreated',
    'synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotDeleted',
    'synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotTextChanged',
    'synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotPositionChanged'],
    function (
        dropspotCreated,
        dropspotDeleted,
        dropspotTextChanged,
        dropspotPositionChanged) {
        "use strict";

        return {
            dropspotCreated: dropspotCreated,
            dropspotDeleted: dropspotDeleted,
            dropspotTextChanged: dropspotTextChanged,
            dropspotPositionChanged: dropspotPositionChanged,
        };

    });