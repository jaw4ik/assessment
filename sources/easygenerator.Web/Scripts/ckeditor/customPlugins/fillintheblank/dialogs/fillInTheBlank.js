(function () {

    var plugin = CKEDITOR.plugins.fillintheblank;

    CKEDITOR.dialog.add(plugin.dialogNames.fillInTheBlank, function (editor) {
        var lang = editor.lang.fillintheblank,
            $valuesContainer,
            classNames = {
                blankValuesList: 'blank_values_list',
                blankInputValue: 'blank_input_value',
                textBox: 'text_box',
                deleteButton: 'delete_button',
                controlsContainer: 'controls_container',
                fib: 'fill_in_the_blanks',
                addValueButton: 'add_value_button',
                validationMessage: 'validation_message'
            },
            selectors = {
                textBox: '.' + classNames.textBox,
                dropDownValue: '.' + classNames.dropDownValue,
                blankInputValue: '.' + classNames.blankInputValue
            };

        function getValuesContainer() {
            var valuesContainerDomId = CKEDITOR.dialog.getCurrent().getContentElement('info', 'valuesList').domId;
            return $('#' + valuesContainerDomId);
        }

        function getValuesList() {
            var valuesList = [];
            $valuesContainer.children().each(function (index, control) {
                var value = $(selectors.textBox, control).val();
                valuesList.push(value.trim());
            });
            return valuesList;
        }

        function clearValuesContainer() {
            $valuesContainer.empty();
        }

        function createBlankInputControl(value, setFocus) {
            var $textBox = createTextBox(value);

            var $blankInputValueControl = $('<div>')
                .addClass(classNames.blankInputValue)
                .append($textBox)
                .append(createDeleteButton());

            function selectText() {
                $textBox.select();
            }

            if (setFocus) {
                _.defer(selectText);
            }

            $textBox.click(selectText);
            $blankInputValueControl.focus = selectText;
            $valuesContainer.append($blankInputValueControl);

            return $blankInputValueControl;

            function createTextBox(value) {
                return $('<input type="text">').addClass(classNames.textBox).addClass('cke_dialog_ui_input_text').val(value);
            }

            function createDeleteButton() {
                return $('<a>').addClass(classNames.deleteButton).addClass('cke_dialog_ui_button').append($('<span>').addClass('cke_dialog_ui_button')).prop('title', lang.deleteButtonTitle).click(remove);

                function remove() {
                    if (!ensureCanDeleteInputValueControls())
                        return;

                    $(this).closest(selectors.blankInputValue).remove();
                }
            }
        }

        function ensureCanDeleteInputValueControls() {
            if ($(selectors.blankInputValue, $valuesContainer).length > 1) {
                hideValidationMessage();
                return true;
            } else {
                showValidationMessage();
                return false;
            }
        }

        function showValidationMessage() {
            CKEDITOR.dialog.getCurrent().getContentElement('info', 'validationMessage').getElement().show();
        }

        function hideValidationMessage() {
            CKEDITOR.dialog.getCurrent().getContentElement('info', 'validationMessage').getElement().hide();
        }

        var
            dialogDefinition = {
                title: lang.popupTitle,
                minWidth: 400,
                minHeight: 70,
                resizable: CKEDITOR.DIALOG_RESIZE_NONE,
                onShow: function () {
                    $valuesContainer = getValuesContainer();
                    clearValuesContainer();
                    editor.fire(plugin.events.addBlank);

                    $valuesContainer.keydown(function (event) {
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
                         className: classNames.blankValuesList,
                         children: [],
                         setup: function (widget) {
                             hideValidationMessage();
                             if (widget.data.selectedText) {
                                 createBlankInputControl(widget.data.selectedText.trim(plugin.spaceSymbol), true);
                             } else {
                                 if (!widget.data.blankValuesList || widget.data.blankValuesList.length === 0) {
                                     createBlankInputControl('', true);
                                     return;
                                 }

                                 widget.data.blankValuesList.forEach(function (value, index) {
                                     createBlankInputControl(value, index === 0);
                                 });
                             }
                         },
                         commit: function (widget) {
                             if (widget.data.selectedText) {
                                 widget.setData('selectedText', null);
                             }
                             var values = getValuesList();
                             widget.setData('blankValue', values.join('; '));
                             widget.setData('blankValuesList', values);
                         }
                     },
                     {
                         type: 'hbox',
                         className: classNames.controlsContainer + ' ' + classNames.fib,
                         children: [
                             {
                                 type: 'button',
                                 label: lang.addAnswer,
                                 className: classNames.addValueButton,
                                 onClick: function () {
                                     createBlankInputControl().focus();
                                     ensureCanDeleteInputValueControls();
                                 }
                             },
                             {
                                 type: 'html',
                                 id: 'validationMessage',
                                 className: classNames.validationMessage,
                                 hidden: true,
                                 html: lang.blankPopupValidationMessage
                             }
                         ]
                     }
                    ]
                }]
            };

        return dialogDefinition;
    });

})();