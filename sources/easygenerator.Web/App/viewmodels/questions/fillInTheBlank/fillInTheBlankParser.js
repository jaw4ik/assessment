define(['durandal/system'], function (system) {

    "use strict";

    var cssSelectors = {
        blankInput: '.blankInput',
        blankDropDown: '.blankSelect'
    };

    var attributes = {
        id: 'id',
        groupId: 'data-group-id',
        answerValues:'data-answer-values',
        value: 'value',
        checked: 'checked'
    };
    var accessoryTag = '<output>';

    return {
        getTemplateAndAnswers: getTemplateAndAnswers,
        getData: getData
    };

    function getTemplateAndAnswers(text) {
        if (_.isNullOrUndefined(text)) {
            return {
                template: null,
                answers: []
            };
        }
        var
            $text = $(accessoryTag).append($.parseHTML(text)),
            blankInputs = $(cssSelectors.blankInput, $text),
            blankDropDowns = $(cssSelectors.blankDropDown, $text);

        var answers = [];

        _.each(blankInputs, function (item) {
            var $input = $(item),
                groupId = $input.attr(attributes.groupId);

            if (_.isEmptyOrWhitespace(groupId)) {
                groupId = generateGuid();
                $input.attr(attributes.groupId, groupId);
            }

            let answerValues = JSON.parse($input.attr(attributes.answerValues));
            if (!_.isArray(answerValues)) {
                answerValues = [];
            }

            $input.attr(attributes.value, '');
            $input.removeAttr(attributes.answerValues);

            answerValues.forEach(answer => {
                answers.push({
                    groupId: groupId,
                    text: answer.trim(),
                    isCorrect: true
                });
            });
        });
        _.each(blankDropDowns, function (item) {
            var $select = $(item),
                groupId = $select.attr(attributes.groupId);

            if (_.isEmptyOrWhitespace(groupId)) {
                groupId = generateGuid();
                $select.attr(attributes.groupId, groupId);
            }

            $('option', $select).each(function (index, option) {
                var $option = $(option);

                answers.push({
                    groupId: groupId,
                    text: $option.val(),
                    isCorrect: $option.attr(attributes.checked) === 'checked'
                });
                $option.attr(attributes.checked, null);
            });
        });
        return {
            template: $text.html(),
            answers: answers
        };
    }

    function getData(template, answers) {
        var
            $text = $(accessoryTag).append($.parseHTML(template)),
            blankInputs = $(cssSelectors.blankInput, $text),
            blankDropDowns = $(cssSelectors.blankDropDown, $text);

        _.each(blankInputs, function (input) {
            var $input = $(input),
                groupId = $input.attr(attributes.groupId);

            var answerValues = _.filter(answers, function (item) {
                return item.groupId === groupId;
            });

            if (answerValues.length > 0) {
                let answerTexts = _.map(answerValues, a => encodeString(a.text));
                $input.attr(attributes.answerValues, JSON.stringify(answerTexts));
            }
        });

        _.each(blankDropDowns, function (select) {
            var $select = $(select),
                groupId = $select.attr(attributes.groupId);

            var correctAnswer = _.find(answers, function (item) {
                return item.groupId === groupId && item.isCorrect;
            });

            if (!_.isNullOrUndefined(correctAnswer)) {
                $('option', $select).each(function (index, element) {
                    var $element = $(element);
                    if ($element.val() === correctAnswer.text) {
                        $element.attr(attributes.checked, 'checked');
                    }
                    $element.val(encodeString($element.val()));
                });
            }
        });

        return $text.html();
    }

    function generateGuid() {
        return system.guid().replace(/[-]/g, '');
    }

    function encodeString(str) {
        return $('<div/>').text(str).html();
    }

});