ko.bindingHandlers.selectBox = {
    cssClasses: {
        selectbox: 'selectbox',
        optionsList: 'selectbox-options-list',
        optionItem: 'selectbox-option-item',
        currentItem: 'selectbox-current-item',
        currentItemText: 'selectbox-current-item-text',
        caret: 'selectbox-caret'
    },
    init: function (element) {
        var $element = $(element),
            selectBox = ko.bindingHandlers.selectBox,
            cssClasses = selectBox.cssClasses;

        $element.addClass(cssClasses.selectbox);

        var $currentItemElement = $('<div />')
            .addClass(cssClasses.currentItem)
            .appendTo($element);

        $('<div />')
            .addClass(cssClasses.currentItemText)
            .appendTo($currentItemElement);

        $('<div />')
            .addClass(cssClasses.caret)
            .appendTo($currentItemElement);

        var $optionsListElement = $('<ul />')
            .addClass(cssClasses.optionsList)
            .appendTo($element)
            .hide();

        $currentItemElement.on('click', function (e) {
            $optionsListElement.toggle();
            e.stopPropagation();
        });

        $('html').click(function () {
            $optionsListElement.hide();
        });
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            $optionsListElement = $element.find('ul'),
            cssClasses = ko.bindingHandlers.selectBox.cssClasses,
            $currentItemTextElement = $element.find('div.' + cssClasses.currentItemText);

        fillInOptionsList();

        function fillInOptionsList() {
            var options = valueAccessor().options,
            optionsText = valueAccessor().optionsText,
            value = valueAccessor().value,
            optionsValue = valueAccessor().optionsValue,
            defaultText = valueAccessor().defaultText,
            selectedOption = null;

            var currentValue = ko.unwrap(value);
            if (_.isNullOrUndefined(currentValue)) {
                $currentItemTextElement.text(defaultText);
            }
            else {
                selectedOption = _.find(options, function (item) {
                    return item[optionsValue] === currentValue;
                });

                $currentItemTextElement.text(selectedOption[optionsText]);
            }

            $optionsListElement.empty();
            
            _.each(options, function (option) {
                if (!_.isNullOrUndefined(selectedOption) && option[optionsValue] === selectedOption[optionsValue])
                    return;

                $('<li />')
                   .addClass(cssClasses.optionItem)
                   .appendTo($optionsListElement)
                   .text(option[optionsText])
                   .data('value', option[optionsValue])
                   .on('click', function (e) {
                       value($(e.target).data('value'));
                       $element.trigger('change');
                   });
            });
        }
    },
};