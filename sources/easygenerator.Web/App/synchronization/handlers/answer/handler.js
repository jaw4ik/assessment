define(['synchronization/handlers/answer/eventHandlers/created', 'synchronization/handlers/answer/eventHandlers/deleted', 'synchronization/handlers/answer/eventHandlers/textUpdated',
'synchronization/handlers/answer/eventHandlers/multipleSelectAnswerCorrectnessUpdated', 'synchronization/handlers/answer/eventHandlers/singleSelectTextAnswerCorrectnessUpdated'],
    function (created, deleted, textUpdated, multipleSelectAnswerCorrectnessUpdated, singleSelectTextAnswerCorrectnessUpdated) {
        "use strict";

        return {
            created: created,
            deleted: deleted,
            textUpdated: textUpdated,
            multipleSelectAnswerCorrectnessUpdated: multipleSelectAnswerCorrectnessUpdated,
            singleSelectTextAnswerCorrectnessUpdated: singleSelectTextAnswerCorrectnessUpdated
        };

    });