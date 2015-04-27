(function () {

    var plugin = CKEDITOR.plugins.fillintheblank;

    CKEDITOR.dialog.add(plugin.dialogNames.fillInTheBlankDropDown, function (editor) {

        var
            lang = editor.lang.fillintheblank,
            classNames = {
                dropDownValuesList: 'drop_down_values_list',
                dropDownValue: 'drop_down_value',
                radioButton: 'radio_button',
                textBox: 'text_box',
                deleteButton: 'delete_button',
                controlsContainer: 'controls_container',
                addValueButton: 'add_value_button',
                validationMessage: 'validation_message'
            },
            selectors = {
                radioButton: 'input[name=correctValue]',
                checkedRadioButton: 'input[name=correctValue]:checked',
                textBox: '.' + classNames.textBox,
                dropDownValue: '.' + classNames.dropDownValue
            };

        var $dropDownValuesContainer;

        function getDropDownValuesContainer() {
            var valuesContainerDomId = CKEDITOR.dialog.getCurrent().getContentElement('info', 'valuesList').domId;
            return $('#' + valuesContainerDomId);
        }

        function getValuesList() {
            var valuesList = [];
            $dropDownValuesContainer.children().each(function (index, control) {
                var value = $(selectors.textBox, control).val();
                valuesList.push(value.trim());
            });
            return valuesList;
        }

        function clearDropDownValuesList() {
            $dropDownValuesContainer.empty();
        }

        function createDropDownValueControl(value, isSelected) {
            var $textBox = createTextBox(value);

            var $dropDownValueControl = $('<div>')
                .addClass(classNames.dropDownValue)
                .append(createRadioButton(isSelected))
                .append($textBox)
                .append(createDeleteButton());

            function selectText() {
                $textBox.select();
            }

            $textBox.click(selectText);
            $dropDownValueControl.focus = selectText;

            if (isSelected) {
                _.defer(selectText);
            }

            $dropDownValuesContainer.append($dropDownValueControl);

            return $dropDownValueControl;

            function createTextBox(value) {
                return $('<input type="text">').addClass(classNames.textBox).addClass('cke_dialog_ui_input_text').val(value);
            }

            function createDeleteButton() {
                return $('<a>').addClass(classNames.deleteButton).addClass('cke_dialog_ui_button').append($('<span>').addClass('cke_dialog_ui_button')).prop('title', lang.deleteButtonTitle).click(remove);

                function remove() {
                    var dropDownValueCount = $(selectors.dropDownValue, $dropDownValuesContainer).length;
                    if (dropDownValueCount <= 2) {
                        showValidationMessage();
                        return;
                    }

                    $(this).closest(selectors.dropDownValue).remove();

                    if (_.isNullOrUndefined(getSelectedValue())) {
                        $(selectors.radioButton, $dropDownValuesContainer).first().prop('checked', true);
                    }
                }
            }

            function createRadioButton(isSelected) {
                var $radioButton = $('<input type="radio">').attr('name', 'correctValue').addClass(classNames.radioButton).addClass('cke_dialog_ui_radio_input');

                if (isSelected) {
                    $radioButton.prop('checked', true);
                    setCorrectTitle($radioButton);
                } else {
                    setIncorrectTitle($radioButton);
                }

                $radioButton.change(function () {
                    setIncorrectTitle($(selectors.radioButton, $dropDownValuesContainer));
                    setCorrectTitle($(this));
                });

                return $radioButton;

                function setCorrectTitle($elements) {
                    $elements.prop('title', lang.correctRadioOptionTitle);
                }

                function setIncorrectTitle($elements) {
                    $elements.prop('title', lang.incorrectRadioOptionTitle);
                }
            }
        }

        function getSelectedValue() {
            return $(selectors.checkedRadioButton, $dropDownValuesContainer).next(selectors.textBox).val().trim();
        }

        function createDefaultValues(defaultValues, selectedText) {
            defaultValues.forEach(function (value, index) {
                if (index === 0) {
                    createDropDownValueControl(selectedText ? selectedText : value, true);
                } else {
                    createDropDownValueControl(value, false);
                }
            });
        }

        function showValidationMessage() {
            CKEDITOR.dialog.getCurrent().getContentElement('info', 'validationMessage').getElement().show();
        }

        function hideValidationMessage() {
            CKEDITOR.dialog.getCurrent().getContentElement('info', 'validationMessage').getElement().hide();
        }

        var dialogDefinition = {
            title: lang.dropDownPopupTitle,
            defaultValues: [lang.firstDefaultValue, lang.secondDefaultValue],
            minWidth: 470,
            minHeight: 30,
            resizable: CKEDITOR.DIALOG_RESIZE_NONE,
            onShow: function () {
                editor.fire(plugin.events.addDropDownBlank);

                $dropDownValuesContainer = getDropDownValuesContainer();

                hideValidationMessage();
                clearDropDownValuesList();

                $dropDownValuesContainer.keydown(function (event) {
                    if (event.keyCode === $.ui.keyCode.TAB) {
                        event.stopPropagation();
                    }
                });
            },
            contents: [
            {
                id: 'info',
                elements: [
                    {
                        type: 'vbox',
                        id: 'valuesList',
                        className: classNames.dropDownValuesList,
                        children: [],
                        setup: function (widget) {
                            if (!widget.data.dropDownValues || widget.data.dropDownValues.length === 0) {
                                createDefaultValues(dialogDefinition.defaultValues, widget.data.selectedText.trim(plugin.spaceSymbol));
                                return;
                            }

                            widget.data.dropDownValues.forEach(function (value) {
                                createDropDownValueControl(value, value === widget.data.blankValue);
                            });
                        },
                        commit: function (widget) {
                            if (widget.data.selectedText) {
                                widget.setData('selectedText', null);
                            }

                            widget.setData('dropDownValues', getValuesList());
                            widget.setData('blankValue', getSelectedValue() || '');
                        }
                    },
                    {
                        type: 'hbox',
                        className: classNames.controlsContainer,
                        children: [
                            {
                                type: 'button',
                                label: lang.addAnswer,
                                className: classNames.addValueButton,
                                onClick: function () {
                                    createDropDownValueControl().focus();
                                    hideValidationMessage();
                                }
                            },
                            {
                                type: 'html',
                                id: 'validationMessage',
                                className: classNames.validationMessage,
                                hidden: true,
                                html: lang.dropDownPopupValidationMessage
                            }
                        ]
                    }
                ]
            }]
        };

        return dialogDefinition;
    });

})();