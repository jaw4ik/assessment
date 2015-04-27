define([
    'synchronization/handlers/questions/hotSpot/eventHandlers/polygonCreated',
    'synchronization/handlers/questions/hotSpot/eventHandlers/polygonDeleted',
    'synchronization/handlers/questions/hotSpot/eventHandlers/polygonChanged',
    'synchronization/handlers/questions/hotSpot/eventHandlers/isMultipleChanged'],
    function (
        polygonCreated,
        polygonDeleted,
        polygonChanged,
        isMultipleChanged) {
        "use strict";

        return {
            polygonCreated: polygonCreated,
            polygonDeleted: polygonDeleted,
            polygonChanged: polygonChanged,
            isMultipleChanged: isMultipleChanged
        };

    });