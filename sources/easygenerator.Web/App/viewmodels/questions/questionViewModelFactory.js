define(['viewmodels/questions/multipleSelect/multipleSelect',
        'viewmodels/questions/fillInTheBlank/fillInTheBlank',
        'viewmodels/questions/dragAndDropText/dragAndDropText',
        'viewmodels/questions/singleSelectText/singleSelectText',
        'viewmodels/questions/textMatching/textMatching',
        'viewmodels/questions/singleSelectImage/singleSelectImage',
        'viewmodels/questions/informationContent/informationContent',
        'viewmodels/questions/statement/statement',
        'viewmodels/questions/hotSpot/hotSpot',
        'viewmodels/questions/openQuestion/openQuestion'],
    function (multipleSelect, fillInTheBlank, dragAndDropText, singleSelectText, textMatching, singleSelectImage, informationContent, statement, hotspot, openQuestion) {
        "use strict";

        return {
            multipleSelect: multipleSelect,
            fillInTheBlank: fillInTheBlank,
            dragAndDropText: dragAndDropText,
            singleSelectText: singleSelectText,
            textMatching: textMatching,
            singleSelectImage: singleSelectImage,
            informationContent: informationContent,
            statement:statement,
            hotspot: hotspot,
            openQuestion: openQuestion
        };

    }
);