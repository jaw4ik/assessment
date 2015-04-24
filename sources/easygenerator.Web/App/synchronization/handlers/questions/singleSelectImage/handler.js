define([
    'synchronization/handlers/questions/singleSelectImage/eventHandlers/answerCreated',
    'synchronization/handlers/questions/singleSelectImage/eventHandlers/answerDeleted',
    'synchronization/handlers/questions/singleSelectImage/eventHandlers/answerImageUpdated',
    'synchronization/handlers/questions/singleSelectImage/eventHandlers/correctAnswerChanged'],
    function (
        answerCreated,
        answerDeleted,
        answerImageUpdated,
        correctAnswerChanged) {
        "use strict";

        return {
            answerCreated: answerCreated,
            answerDeleted: answerDeleted,
            answerImageUpdated: answerImageUpdated,
            correctAnswerChanged: correctAnswerChanged
        };

    });