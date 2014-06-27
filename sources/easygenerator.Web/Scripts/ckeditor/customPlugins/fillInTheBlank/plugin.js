(function () {

    CKEDITOR.plugins.fillInTheBlank = {
        requires: 'widget',
        lang: 'en',
        commands: {
            addBlank: 'addBlank'
        },
        hotkey: CKEDITOR.CTRL + 81 /*Q*/, 
        fillInTheBlankDialogName: 'fillInTheBlankDialog',
        dataTag: 'input',
        spaceSymbol: '&zwnj;',
        classNames: {
            blankInput: 'blankInput',
            blankField: 'blankField',
            blankValue: 'blankValue',
            close: 'close',
            new: 'new',
            cke_focused: 'cke_widget_editable_focused'
        },
        events: {
            removeBlank: 'removeEditable'
        },
        widgetTag: 'span',
        init: function (editor) {
           
            //region "paste for IE"
            var caretPositionForPaste = null;
            //endregion "paste for IE"
            var extraRemoveFormatTags = "a";
            var tagsRegex = editor._.removeFormatRegex || (editor._.removeFormatRegex = new RegExp('^(?:' + editor.config.removeFormatTags.replace(/,/g, '|') + "|" + extraRemoveFormatTags.replace(/,/g, '|') + ')$', 'i'));

            var plugin = CKEDITOR.plugins.fillInTheBlank;
            var classNames = plugin.classNames;
            var widgetTag = plugin.widgetTag;


            editor.setKeystroke(plugin.hotkey, plugin.commands.addBlank);

            editor.on('paste', function (evt) {
                var $data = $('<output>').append($.parseHTML(evt.data.dataValue));
                $('.' + classNames.blankField, $data).removeAttr('data-group-id');
                evt.data.dataValue = $data.html();
            });

            editor.widgets.add(plugin.commands.addBlank, {
                draggable: false,
                defaults: function () {
                    var selectedContent = '';
                    var selection = editor.getSelection();
                    if (selection != null && selection.getType() == CKEDITOR.SELECTION_TEXT && selection.getSelectedText() != '') {
                        selectedContent = selection.getSelectedText();
                    } else if (selection != null && selection.getType() == CKEDITOR.SELECTION_ELEMENT) {
                        selectedContent = selection.getSelectedElement().getText();
                    }
                    return { selectedText: selectedContent };
                },
                dialog: plugin.fillInTheBlankDialogName,
                template: '<' + widgetTag + ' class="' + classNames.blankField + ' ' + classNames.new + '">' +
                    '<' + widgetTag + ' class="' + classNames.blankValue + '">' +
                    '{selectedText}' +
                    '</' + widgetTag + '>' +
                    '<' + widgetTag + ' class="' + classNames.close + '">' + plugin.spaceSymbol + '</' + widgetTag + '>' +
                    '</' + widgetTag + '>',
                parts: {
                    blankValue: widgetTag + '.' + classNames.blankValue,
                    close: widgetTag + '.' + classNames.close
                },
                upcast: function (element, data) {
                    if (element.name === plugin.dataTag && _.contains(element.classes, classNames.blankInput)) {
                        var value = element.attributes.value;
                        data.blankValue = value;
                        var groupId = element.attributes['data-group-id'];

                        var blankFieldElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'data-group-id': groupId,
                            class: classNames.blankField,
                            contenteditable: "false"
                        });

                        var blankValueElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            class: classNames.blankValue,
                        contenteditable: "false"
                        });
                        blankFieldElement.add(blankValueElement);

                        var closeElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            class: classNames.close,
                            contenteditable: "false"
                        });
                        closeElement.add(new CKEDITOR.htmlParser.text(plugin.spaceSymbol));
                        blankFieldElement.add(closeElement);

                        element.replaceWith(blankFieldElement);

                        return blankFieldElement;
                    }
                },
                data: function () {
                    if (!_.isNullOrUndefined(this.data.blankValue)) {
                        this.parts.blankValue.setHtml(this.data.blankValue);
                    }
                },
                init: function () {
                    var widget = this;
                    var clearFormating = function (widgetElement) {
                        if (editor.getSelection()) {
                            var currentElement,
                                widgetRootElement = widgetElement.getParent();
                            while ((currentElement = widgetRootElement.getParent()) != null && tagsRegex.test(currentElement.getName())) {
                                widgetRootElement.breakParent(currentElement);
                            }
                        }
                    };

                    var addCloseButtonEventHandler = function (widget) {
                        widget.parts.close.on('click', function (event) {
                            _.defer(function () {
                                widget.repository.del(widget);
                                widget.fire(plugin.events.removeBlank);
                                editor.fire('change');
                            });
                            event.data.preventDefault();
                            event.data.stopPropagation();
                        });
                    };

                    addCloseButtonEventHandler(widget);

                    widget.on('ready', function () {
                        if (widget.element.hasClass(plugin.classNames.new)) {
                            clearFormating(widget.element);
                        }
                    });

                    $(widget.wrapper.$).on('click', function (evt) {
                        widget.edit();
                    });

                },
                downcast: function (element, data) {
                    if (element.hasClass(plugin.classNames.blankField)) {
                        var value = '';
                        var groupId = element.attributes['data-group-id'];

                        for (var index in element.children) {
                            var valueElement = element.children[index];
                            if (valueElement.hasClass(plugin.classNames.blankValue)) {
                                value = valueElement.getHtml();
                            }
                        }
                        return new CKEDITOR.htmlParser.element(plugin.dataTag, {
                            'data-group-id': groupId != undefined ? groupId : '',
                            value: value,
                            class: plugin.classNames.blankInput
                        });
                    }
                }
            });
        }
    };
    
    CKEDITOR.plugins.add('fillInTheBlank', CKEDITOR.plugins.fillInTheBlank);
    CKEDITOR.document.appendStyleSheet(CKEDITOR.plugins.fillInTheBlank.path + 'styles.css');
    CKEDITOR.dialog.add(CKEDITOR.plugins.fillInTheBlank.fillInTheBlankDialogName, CKEDITOR.plugins.fillInTheBlank.path + 'dialogs/fillInTheBlank.js');

})();