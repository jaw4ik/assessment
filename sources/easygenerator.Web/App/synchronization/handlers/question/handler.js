define([
    'synchronization/handlers/question/eventHandlers/titleUpdated',
    'synchronization/handlers/question/eventHandlers/contentUpdated',
    'synchronization/handlers/question/eventHandlers/correctFeedbackUpdated',
    'synchronization/handlers/question/eventHandlers/incorrectFeedbackUpdated',
    'synchronization/handlers/question/eventHandlers/created',
    'synchronization/handlers/question/eventHandlers/deleted',
    'synchronization/handlers/question/eventHandlers/fillInTheBlankUpdated',
    'synchronization/handlers/question/eventHandlers/dragAndDrop/backgroundChanged',
    'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotCreated',
    'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotDeleted',
    'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotTextChanged',
    'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotPositionChanged',
    'synchronization/handlers/question/eventHandlers/textMatching/answerCreated',
    'synchronization/handlers/question/eventHandlers/textMatching/answerDeleted',
    'synchronization/handlers/question/eventHandlers/textMatching/answerKeyChanged',
    'synchronization/handlers/question/eventHandlers/textMatching/answerValueChanged'],
    function (titleUpdated,
        contentUpdated,
        correctFeedbackUpdated,
        incorrectFeedbackUpdated,
        created, deleted,
        fillInTheBlankUpdated,
        dragAndDropBackgroundChanged,
        dragAndDropDropspotCreated, 
        dragAndDropDropspotDeleted,
        dragAndDropDropspotTextChanged,
        dragAndDropDropspotPositionChanged,
        textMatchingAnswerCreated,
        textMatchingAnswerDeleted,
        textMatchingAnswerKeyChanged,
        textMatchingAnswerValueChanged) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            contentUpdated: contentUpdated,
            correctFeedbackUpdated: correctFeedbackUpdated,
            incorrectFeedbackUpdated: incorrectFeedbackUpdated,
            created: created,
            deleted: deleted,
            fillInTheBlankUpdated: fillInTheBlankUpdated,

            dragAndDropBackgroundChanged: dragAndDropBackgroundChanged,
            dragAndDropDropspotCreated: dragAndDropDropspotCreated,
            dragAndDropDropspotDeleted: dragAndDropDropspotDeleted,
            dragAndDropDropspotTextChanged: dragAndDropDropspotTextChanged,
            dragAndDropDropspotPositionChanged: dragAndDropDropspotPositionChanged,

            textMatchingAnswerCreated: textMatchingAnswerCreated,
            textMatchingAnswerDeleted: textMatchingAnswerDeleted,
            textMatchingAnswerKeyChanged: textMatchingAnswerKeyChanged,
            textMatchingAnswerValueChanged: textMatchingAnswerValueChanged
        };

    });