define(['synchronization/handlers/answer/eventHandlers/created', 'synchronization/handlers/answer/eventHandlers/deleted', 'synchronization/handlers/answer/eventHandlers/textUpdated',
'synchronization/handlers/answer/eventHandlers/multipleSelectAnswerCorrectnessUpdated', 'synchronization/handlers/answer/eventHandlers/multiplechoiceAnswerCorrectnessUpdated'],
    function (created, deleted, textUpdated, multipleSelectAnswerCorrectnessUpdated, multiplechoiceAnswerCorrectnessUpdated) {
        "use strict";

        return {
            created: created,
            deleted: deleted,
            textUpdated: textUpdated,
            multipleSelectAnswerCorrectnessUpdated: multipleSelectAnswerCorrectnessUpdated,
            multiplechoiceAnswerCorrectnessUpdated: multiplechoiceAnswerCorrectnessUpdated
        };

    });