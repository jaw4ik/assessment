ko.bindingHandlers.selectBox = {
    cssClasses: {
        selectbox: 'selectbox',
        optionsList: 'selectbox-options-list',
        optionItem: 'selectbox-option-item',
        currentItem: 'selectbox-current-item',
        currentItemText: 'selectbox-current-item-text',
        caretHolder: 'selectbox-caret-holder',
        caret: 'selectbox-caret',
        scroll: 'selectbox-scroll',
        filter: 'filter',
        filterInput: 'selectbox-filter-input',
        error: 'error',
        focus: 'focus'
    },
    init: function (element, valueAccessor) {
        var $element = $(element),
            selectBox = ko.bindingHandlers.selectBox,
            cssClasses = selectBox.cssClasses,
            initializeFilter = selectBox.initializeFilter,
            filter = valueAccessor().filter,
            options = valueAccessor().options;

        $element.addClass(cssClasses.selectbox);

        var $currentItemElement = $('<div />')
            .addClass(cssClasses.currentItem)
            .appendTo($element);

        var $currentItemTextElement = $('<div />')
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

        var $filterInput = null;
        filter && ($filterInput = initializeFilter(element, valueAccessor));

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
            if (filter) {
                $filterInput.focus();
            }
            e.stopPropagation();
        });

        $('html').click(function () {
            $optionsListElement.hide();
            $currentItemElement.removeClass('expanded');
            if (filter) {
                $currentItemTextElement.show();
                $currentItemElement.removeClass(cssClasses.filter);
            }
        });
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            $optionsListElement = $element.find('ul'),
            cssClasses = ko.bindingHandlers.selectBox.cssClasses,
            filter = valueAccessor().filter,
            $currentItemTextElement = $element.find('div.' + cssClasses.currentItemText),
            $filterInput = $element.find('input.' + cssClasses.filterInput);

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
                if (!filter && !_.isNullOrUndefined(selectedOption) && option[optionsValue] === selectedOption[optionsValue])
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
    initializeFilter: function (element, valueAccessor) {
        var $element = $(element),
            selectBox = ko.bindingHandlers.selectBox,
            cssClasses = selectBox.cssClasses,
            $currentItemElement = $element.find('.' + cssClasses.currentItem),
            $currentItemTextElement = $element.find('div.' + cssClasses.currentItemText),
            tabIndex = valueAccessor().tabindex,
            optionsText = valueAccessor().optionsText,
            value = valueAccessor().value,
            defaultText = valueAccessor().defaultText,
            options = valueAccessor().options,
            $optionsListElement = $element.find('ul.' + cssClasses.optionsList),
            $currentItemCaretHolder = $element.find('.' + cssClasses.caretHolder),
            isFirstBlur = true;

        var $filterInput = $('<input type="text" />')
                .addClass(cssClasses.filterInput)
                .appendTo($currentItemElement);

        !!tabIndex && $filterInput.attr('tabindex', tabIndex);

        $currentItemCaretHolder.on('click', function (e) {
            hideOptionsList();
            e.stopPropagation();
        });

        $filterInput.on('click', function (e) {
            e.stopPropagation();
        });

        $filterInput.on('keyup', function (e) {
            var keyPressed = e.keyCode || e.which,
                currentText = $(this).val(),
                $currentOption = $('.' + cssClasses.optionsList).find('.' + cssClasses.optionItem + '.active');
            scrollToOption(currentText);

            if (currentText == '') {
                clearActiveClassFromOptions();
                scroll($('.selectbox-options-list li:eq(0)'));
            }

            switch (keyPressed) {
                case 13: //enter key
                    if (currentText != '') {
                        selectOption($currentOption.text());
                    }
                    hideOptionsList();
                    $(this).blur();
                    break;
                default:
                    break;
            }
        });

        $filterInput.on('keydown', function (e) {
            var keyPressed = e.keyCode || e.which,
                currentText = $(this).val(),
                $currentOption = $('.' + cssClasses.optionsList).find('.' + cssClasses.optionItem + '.active').first();

            switch (keyPressed) {
                case 9: //tab key
                    if (currentText != '') {
                        selectOption($currentOption.text());
                    }
                    hideOptionsList();
                    break;
                case 38: // up key
                    activateOption(getPrevOption($currentOption));
                    break;
                case 40: // down key
                    activateOption(getNextOption($currentOption));
                    break;
                default:
                    break;
            }
        });

        function getPrevOption(currentOption) {
            var $prevOption = currentOption.prev();
            if ($prevOption.length == 0) {
                $prevOption = $('.selectbox-options-list li:eq(' + (options.length - 1) + ')');
            }

            return $prevOption;
        }

        function getNextOption(currentOption) {
            var $nextOption = currentOption.next();
            if ($nextOption.length == 0) {
                $nextOption = $('.selectbox-options-list li:eq(0)');
            }

            return $nextOption;
        }

        function activateOption($nextOption) {
            clearActiveClassFromOptions();
            $nextOption.addClass('active');
            scroll($nextOption);
            $filterInput.val($nextOption.text());
        }

        $filterInput.on('focus', function () {
            clearActiveClassFromOptions();
            var currentText = $currentItemTextElement.text();
            if (currentText != defaultText) {
                scrollToOption(currentText);
                $(this).val(currentText);
            } else {
                scroll($('.selectbox-options-list li:eq(0)'));
            }
            $currentItemElement.addClass(cssClasses.focus);
            showOptionsList();
        });

        $filterInput.on('blur', function () {
            var currentText = $(this).val();
            if (currentText == '' && isFirstBlur) {
                isFirstBlur = false;
            } else if (currentText == '') {
                setDefaultValue();
            }
            $(this).val('');
            $currentItemElement.removeClass(cssClasses.focus);
        });

        function clearActiveClassFromOptions() {
            _.each($('.selectbox-options-list').children(), function (item) {
                $(item).removeClass('active');
            });
        }

        function setDefaultValue() {
            value(undefined);
            $currentItemTextElement.removeClass('choosen');
            $element.trigger('change');
        }

        function scrollToOption(currentText) {
            var searchItem = getSearchOption(currentText);
            if (!_.isNullOrUndefined(searchItem)) {
                var $optionItem = $('li.' + cssClasses.optionItem + ':contains(\'' + searchItem[optionsText] + '\')').first();
                clearActiveClassFromOptions();
                scroll($optionItem);
                $optionItem.addClass('active');
            }
        }

        function scroll(option) {
            option[0].scrollIntoView();
        }

        function getSearchOption(searchString) {
            if (searchString != '') {
                return _.filter(options, function (option) {
                    var searchValue = option.name.toLowerCase().indexOf(searchString.toLowerCase());
                    return searchValue != -1 && searchValue == 0;
                })[0];
            }
            return null;
        }

        function selectOption(searchText) {
            var selectedOption = _.find(options, function (option) {
                return option[optionsText].toLowerCase() == searchText.toLowerCase();
            });
            if (!_.isNullOrUndefined(selectedOption)) {
                var $optionItem = $('li.' + cssClasses.optionItem + ':contains(\'' + selectedOption[optionsText] + '\')');
                $optionItem.trigger('click');
            }
        }

        function hideOptionsList() {
            $optionsListElement.hide();
            $currentItemElement.removeClass(cssClasses.filter);
            $currentItemTextElement.show();
            $currentItemElement.removeClass('expanded');
        }

        function showOptionsList() {
            $optionsListElement.show();
            $currentItemElement.addClass(cssClasses.filter);
            $currentItemTextElement.hide();
            $currentItemElement.addClass('expanded');
        }

        return $filterInput;
    }
};