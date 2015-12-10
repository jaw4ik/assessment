import system from 'durandal/system';

const cssSelectors = {
    blankInput: '.blankInput',
    blankDropDown: '.blankSelect'
},
    attributes = {
        id: 'id',
        groupId: 'data-group-id',
        answerValues:'data-answer-values',
        matchCase:'data-match-case',
        value: 'value',
        checked: 'checked'
    },
    accessoryTag = '<output>';

export default class Parser{
    static getTemplateAndAnswers(text) {
        if (_.isNullOrUndefined(text)) {
            return {
                template: null,
                answers: []
            };
        }

        let $text = $(accessoryTag).append($.parseHTML(text)),
            blankInputs = $(cssSelectors.blankInput, $text),
            blankDropDowns = $(cssSelectors.blankDropDown, $text),
            answers = [];

        _.each(blankInputs, function (item) {
            let $input = $(item),
                groupId = $input.attr(attributes.groupId),
                matchCase = $input.attr(attributes.matchCase);

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
                    isCorrect: true,
                    matchCase: matchCase
                });
            });
        });
        _.each(blankDropDowns, function (item) {
            let $select = $(item),
                groupId = $select.attr(attributes.groupId);

            if (_.isEmptyOrWhitespace(groupId)) {
                groupId = generateGuid();
                $select.attr(attributes.groupId, groupId);
            }

            $('option', $select).each(function (index, option) {
                let $option = $(option);

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

    static getData(template, answers) {
        let $text = $(accessoryTag).append($.parseHTML(template)),
             blankInputs = $(cssSelectors.blankInput, $text),
             blankDropDowns = $(cssSelectors.blankDropDown, $text);

        _.each(blankInputs, function (input) {
            let $input = $(input),
                groupId = $input.attr(attributes.groupId);

            let answerValues = _.filter(answers, function (item) {
                return item.groupId === groupId;
            });

            if (answerValues.length > 0) {
                let answerTexts = _.map(answerValues, a => encodeString(a.text));
                $input.attr(attributes.answerValues, JSON.stringify(answerTexts));
                $input.attr(attributes.matchCase, answerValues[0].matchCase);
            }
        });

        _.each(blankDropDowns, function (select) {
            let $select = $(select),
                groupId = $select.attr(attributes.groupId);

            let correctAnswer = _.find(answers, function (item) {
                return item.groupId === groupId && item.isCorrect;
            });

            if (!_.isNullOrUndefined(correctAnswer)) {
                $('option', $select).each(function (index, element) {
                    let $element = $(element);
                    if ($element.val() === correctAnswer.text) {
                        $element.attr(attributes.checked, 'checked');
                    }
                    $element.val(encodeString($element.val()));
                });
            }
        });

        return $text.html();
    }
}

function generateGuid() {
    return system.guid().replace(/[-]/g, '');
}

function encodeString(str) {
    return $('<div/>').text(str).html();
}