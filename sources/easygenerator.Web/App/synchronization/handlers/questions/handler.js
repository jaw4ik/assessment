define([
    'synchronization/handlers/questions/dragAndDropText/handler',
    'synchronization/handlers/questions/fillInTheBlank/handler',
    'synchronization/handlers/questions/question/handler',
    'synchronization/handlers/questions/textMatching/handler',
    'synchronization/handlers/questions/singleSelectImage/handler',
    'synchronization/handlers/questions/hotSpot/handler'],
    function (
        dragAndDropText,
        fillInTheBlank,
        question,
        textMatching,
        singleSelectImage,
        hotSpot) {
        "use strict";

        return {
            dragAndDropText: dragAndDropText,
            fillInTheBlank: fillInTheBlank,
            question: question,
            textMatching: textMatching,
            singleSelectImage: singleSelectImage,
            hotSpot: hotSpot
        };

    });