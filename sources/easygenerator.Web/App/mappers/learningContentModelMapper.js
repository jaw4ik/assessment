define(['models/learningContent', 'constants'],
    function (LearningContentModel, constants) {
        "use strict";

        var
            map = function (learningContent) {
                return new LearningContentModel({
                    id: learningContent.Id,
                    text: learningContent.Text,
                    type: getLearningContentType(learningContent.Text),
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
                case constants.learningContentsTypes.hotspot:
                    return constants.learningContentsTypes.hotspot;
                default:
                    return constants.learningContentsTypes.richText;
            }
        }
    });