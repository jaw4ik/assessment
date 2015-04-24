define([
    'synchronization/handlers/questions/textMatching/eventHandlers/answerCreated',
    'synchronization/handlers/questions/textMatching/eventHandlers/answerDeleted',
    'synchronization/handlers/questions/textMatching/eventHandlers/answerKeyChanged',
    'synchronization/handlers/questions/textMatching/eventHandlers/answerValueChanged'],
    function (
        answerCreated,
        answerDeleted,
        answerKeyChanged,
        answerValueChanged) {
        "use strict";

        return {
            answerCreated: answerCreated,
            answerDeleted: answerDeleted,
            answerKeyChanged: answerKeyChanged,
            answerValueChanged: answerValueChanged
        };

    });