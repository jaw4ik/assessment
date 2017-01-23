define(['models/learningContent', 'constants'],
    function (LearningContentModel, constants) {
        "use strict";

        var
            map = function (learningContent) {
                return new LearningContentModel({
                    id: learningContent.Id,
                    text: learningContent.Text,
                    position: learningContent.Position,
                    type: learningContent.Type || getLearningContentType(learningContent.Text),
                    createdOn: learningContent.CreatedOn
                });
            };

        return {
            map: map
        };

        function getLearningContentType(text) {
            var $output = $('<output>');
            $output.html(text);
            var dataType = $('[data-type]', $output).attr('data-type');
            switch (dataType) {
                case constants.contentsTypes.hotspotOnImage:
                    return constants.contentsTypes.hotspotOnImage;
                case constants.contentsTypes.textEditorOneColumn:
                    return constants.contentsTypes.textEditorOneColumn;
                case constants.contentsTypes.linkCuration:
                    return constants.contentsTypes.linkCuration;
                case constants.contentsTypes.textEditorTwoColumns:
                    return constants.contentsTypes.textEditorTwoColumns;
                case constants.contentsTypes.textEditorThreeColumns:
                    return constants.contentsTypes.textEditorThreeColumns;
                case constants.contentsTypes.imageEditorOneColumn:
                    return constants.contentsTypes.imageEditorOneColumn;
                case constants.contentsTypes.imageEditorTwoColumns:
                    return constants.contentsTypes.imageEditorTwoColumns;
                case constants.contentsTypes.imageInTheLeft:
                    return constants.contentsTypes.imageInTheLeft;
                case constants.contentsTypes.imageInTheRight:
                    return constants.contentsTypes.imageInTheRight;
                case constants.contentsTypes.singleVideo:
                    return constants.contentsTypes.singleVideo;
                case constants.contentsTypes.videoInTheLeft:
                    return constants.contentsTypes.videoInTheLeft;
                case constants.contentsTypes.videoInTheRight:
                    return constants.contentsTypes.videoInTheRight;
                case constants.contentsTypes.videoWithText:
                    return constants.contentsTypes.videoWithText;
                default:
                    return constants.contentsTypes.classicEditor;
            }
        }
    });