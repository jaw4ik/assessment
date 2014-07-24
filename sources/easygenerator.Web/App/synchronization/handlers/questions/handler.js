define([
    'synchronization/handlers/questions/dragAndDrop/handler',
    'synchronization/handlers/questions/fillInTheBlank/handler',
    'synchronization/handlers/questions/question/handler',
    'synchronization/handlers/questions/textMatching/handler',
    'synchronization/handlers/questions/singleSelectImage/handler'],
    function (
        dragAndDrop,
        fillInTheBlank,
        question,
        textMatching,
        singleSelectImage) {
        "use strict";

        return {
            dragAndDrop: dragAndDrop,
            fillInTheBlank: fillInTheBlank,
            question: question,
            textMatching: textMatching,
            singleSelectImage: singleSelectImage
        };

    });