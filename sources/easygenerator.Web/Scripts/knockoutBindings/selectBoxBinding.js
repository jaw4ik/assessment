ko.bindingHandlers.selectBox = {
    cssClasses: {
        selectbox: 'selectbox',
        optionsList: 'selectbox-options-list',
        optionItem: 'selectbox-option-item',
        currentItem: 'selectbox-current-item',
        currentItemText: 'selectbox-current-item-text',
        caretHolder: 'selectbox-caret-holder',
        caret: 'selectbox-caret',
        scroll: 'selectbox-scroll'
    },
    init: function (element, valueAccessor) {
        var $element = $(element),
            selectBox = ko.bindingHandlers.selectBox,
            cssClasses = selectBox.cssClasses,
            options = valueAccessor().options;

        $element.addClass(cssClasses.selectbox);

        var $currentItemElement = $('<div />')
            .addClass(cssClasses.currentItem)
            .appendTo($element);

        $('<div />')
            .addClass(cssClasses.currentItemText)
            .appendTo($currentItemElement);

        var $currentItemCaretHolder = $('<div />')
            .addClass(cssClasses.caretHolder)
            .appendTo($currentItemElement);
        
        $('<span />')
            .addClass(cssClasses.caret)
            .appendTo($currentItemCaretHolder);

        var $optionsListElement = $('<ul />')
            .addClass(cssClasses.optionsList)
            .appendTo($element)
            .hide();
        
        if (options.length > 5) {
            $optionsListElement.addClass(cssClasses.scroll);
        }

        $currentItemElement.on('click', function (e) {
            _.each($('.selectbox-options-list'), function (item) {
                if (item != $optionsListElement[0]) {
                    $(item).hide();
                }
            });
            $optionsListElement.toggle();
            $currentItemElement.toggleClass('expanded');
            e.stopPropagation();
        });

        $('html').click(function () {
            $optionsListElement.hide();
            $currentItemElement.removeClass('expanded');
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
                $currentItemTextElement.addClass('choosen');
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