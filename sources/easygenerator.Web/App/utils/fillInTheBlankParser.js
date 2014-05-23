define(['durandal/system'], function (system) {

    "use strict";

    var cssClasses = {
        blankInput: '.blankInput'
    };

    var groupIdAttribute = 'data-group-id',
        valueAttribute = 'value',
        accessoryTag = '<output>';

    var util = {
        getTemplateAndAnswers: getTemplateAndAnswers,
        getData: getData
    };

    return util;

    function getTemplateAndAnswers(text) {
        if (_.isNullOrUndefined(text)) {
            return {
                template: null,
                answers: []
            };
        }
        var $text = $(accessoryTag).append($.parseHTML(text));
        var blankInputs = $(cssClasses.blankInput, $text);

        var answers = [];
        _.each(blankInputs, function (item) {
            var $input = $(item),
                value = $input.val(),
                groupId = $input.attr(groupIdAttribute);
            if (!_.isEmptyOrWhitespace(value)) {
                if (_.isEmptyOrWhitespace(groupId)) {
                    $input.attr(groupIdAttribute, system.guid().replace(/[-]/g, ''));
                }
                $input.attr(valueAttribute, '');
                answers.push({
                    groupId: $input.attr(groupIdAttribute),
                    text: value,
                    isCorrect: true
                });
            }
        });
        return {
            template: $text.html(),
            answers: answers
        };
    }
    
    function getData(template, answers) {
        var $text = $(accessoryTag).append($.parseHTML(template));
        var blankInputs = $(cssClasses.blankInput, $text);
        _.each(blankInputs, function (item) {
            var $input = $(item),
                groupId = $input.attr(groupIdAttribute);
            var answer = _.find(answers, function (item) {
                return item.groupId == groupId;
            });
            if (!_.isNullOrUndefined(answer)) {
                $input.attr(valueAttribute, answer.text);
            }
        });
        return $text.html();
    }

});