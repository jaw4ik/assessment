define([
    'synchronization/handlers/questions/dragAndDrop/eventHandlers/backgroundChanged',
    'synchronization/handlers/questions/dragAndDrop/eventHandlers/dropspotCreated',
    'synchronization/handlers/questions/dragAndDrop/eventHandlers/dropspotDeleted',
    'synchronization/handlers/questions/dragAndDrop/eventHandlers/dropspotTextChanged',
    'synchronization/handlers/questions/dragAndDrop/eventHandlers/dropspotPositionChanged'],
    function (
        backgroundChanged,
        dropspotCreated,
        dropspotDeleted,
        dropspotTextChanged,
        dropspotPositionChanged) {
        "use strict";

        return {
            backgroundChanged: backgroundChanged,
            dropspotCreated: dropspotCreated,
            dropspotDeleted: dropspotDeleted,
            dropspotTextChanged: dropspotTextChanged,
            dropspotPositionChanged: dropspotPositionChanged,
        };

    });