(function () {

    CKEDITOR.plugins.fillintheblank = {
        requires: 'widget',
        lang: 'en,uk,zh-cn,pt-br,de,nl',
        commands: {
            addBlank: 'addBlank',
            addDropDownBlank: 'addDropDownBlank'
        },
        hotkeys: {
            fillInTheBlank: CKEDITOR.CTRL + 81, /*Q*/
            fillInTheBlankDropDown: CKEDITOR.CTRL + CKEDITOR.ALT + 81 /*Q*/
        },
        dialogNames: {
            fillInTheBlank: 'fillInTheBlankDialog',
            fillInTheBlankDropDown: 'fillInTheBlankDropDownDialog',
        },
        dataTags: {
            fillInTheBlank: 'input',
            fillInTheBlankDropDown: 'select',
        },
        spaceSymbol: '\u00a0',
        classNames: {
            blankInput: 'blankInput',
            blankSelect: 'blankSelect',
            blankField: 'blankField',
            blankValue: 'blankValue',
            dropDownIndicator: 'dropDownIndicator',
            close: 'close',
            newBlank: 'new',
            cke_focused: 'cke_widget_editable_focused'
        },
        events: {
            addBlank: 'addBlankEvent',
            addDropDownBlank: 'addDropDownBlankEvent',
            removeBlank: 'removeEditable'
        },
        widgetTag: 'span',
        groupIdAttribute: 'data-group-id',
        encodeString: function (str) {
            var htmlRegex = /<[a-z].*>/gi;
            return htmlRegex.test(str)
                ? $('<div/>').text(str).html()
                : str;
        },
        decodeString: function (str) {
            var encodedHtmlRegex = /(&amp;|&quot;|&#39;|&lt;|&gt;)/gi;
            var decodedString = $('<div/>').html(str).text();
            if (encodedHtmlRegex.test(decodedString)) {
                return CKEDITOR.plugins.fillintheblank.decodeString(decodedString);
            } else {
                return decodedString;
            }
        },
        init: function (editor) {

            var extraRemoveFormatTags = "a";
            var tagsRegex = editor._.removeFormatRegex || (editor._.removeFormatRegex = new RegExp('^(?:' + editor.config.removeFormatTags.replace(/,/g, '|') + "|" + extraRemoveFormatTags.replace(/,/g, '|') + ')$', 'i'));

            var plugin = CKEDITOR.plugins.fillintheblank;
            var classNames = plugin.classNames;
            var widgetTag = plugin.widgetTag;

            editor.setKeystroke(plugin.hotkeys.fillInTheBlank, plugin.commands.addBlank);
            editor.setKeystroke(plugin.hotkeys.fillInTheBlankDropDown, plugin.commands.addDropDownBlank);

            editor.on('paste', function (evt) {
                var $data = $('<output>').append($.parseHTML(evt.data.dataValue));

                $('.' + classNames.blankField, $data).removeAttr(plugin.groupIdAttribute);
                $('.' + classNames.dropDownIndicator, $data).removeAttr('style');
                $('.' + classNames.close, $data).removeAttr('style');

                var $blankValue = $('.' + classNames.blankValue, $data);
                if (!$blankValue.html()) {
                    $blankValue.html(plugin.spaceSymbol);
                }

                evt.data.dataValue = $data.html();
            });

            //#region WIDGETS DEFINITION

            function getWidgetDefaults() {
                var selectedContent = '';
                var selection = editor.getSelection();
                if (selection != null && selection.getType() == CKEDITOR.SELECTION_TEXT && selection.getSelectedText() != '') {
                    selectedContent = selection.getSelectedText();
                } else if (selection != null && selection.getType() == CKEDITOR.SELECTION_ELEMENT) {
                    selectedContent = selection.getSelectedElement().getText();
                }
                return { selectedText: selectedContent };
            }

            function setWidgetData() {
                if (!_.isNullOrUndefined(this.data.blankValue)) {
                    this.parts.blankValue.setHtml(plugin.encodeString(this.data.blankValue));
                }
            }

            function initWidget() {
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
                    if (!widget.parts.close) {
                        widget.repository.del(widget);
                        editor.fire('change');
                        return;
                    }

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

                widget.on('ready', function () {
                    addCloseButtonEventHandler(widget);

                    if (widget.element.hasClass(plugin.classNames.newBlank)) {
                        clearFormating(widget.element);
                    }
                    var nextSibling = widget.wrapper.$.nextSibling;
                    if (nextSibling == null || (nextSibling.nodeType == 3 && nextSibling.data == '')) {
                        $(widget.wrapper.$).after('\u00a0');
                    }
                });

                $(widget.wrapper.$).on('click', function (evt) {
                    widget.edit();
                });
            }

            editor.widgets.add(plugin.commands.addBlank, {
                draggable: false,
                mask: true,

                defaults: getWidgetDefaults,
                data: setWidgetData,
                init: initWidget,

                dialog: plugin.dialogNames.fillInTheBlank,
                template:
                    '<' + widgetTag + ' class="' + classNames.blankField + ' ' + classNames.blankInput + ' ' + classNames.newBlank + '">' +
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
                    if (element.name === plugin.dataTags.fillInTheBlank && _.contains(element.classes, classNames.blankInput)) {
                        var values = JSON.parse(element.attributes['data-answer-values']);
                        values = _.map(values, function (value) { return plugin.decodeString(value); });
                        data.blankValue = values.join('; ');
                        data.blankValuesList = values;

                        var groupId = element.attributes[plugin.groupIdAttribute];

                        var blankFieldElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'data-group-id': groupId,
                            'class': classNames.blankField + ' ' + classNames.blankInput
                        });

                        var blankValueElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'class': classNames.blankValue
                        });
                        blankFieldElement.add(blankValueElement);

                        var closeElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'class': classNames.close
                        });
                        closeElement.add(new CKEDITOR.htmlParser.text(plugin.spaceSymbol));
                        blankFieldElement.add(closeElement);

                        element.replaceWith(blankFieldElement);

                        return blankFieldElement;
                    }
                    return false;
                },
                downcast: function (element) {
                    if (element.hasClass(plugin.classNames.blankInput)) {
                        var
                            values = _.map(this.data.blankValuesList, function (answer) { return plugin.encodeString(answer); }),
                            groupId = element.attributes[plugin.groupIdAttribute] || '';

                        return new CKEDITOR.htmlParser.element(plugin.dataTags.fillInTheBlank, {
                            'data-group-id': groupId,
                            'data-answer-values': JSON.stringify(values),
                            'class': plugin.classNames.blankInput
                        });
                    }
                    return false;
                }
            });

            editor.widgets.add(plugin.commands.addDropDownBlank, {
                draggable: false,
                mask: true,

                defaults: getWidgetDefaults,
                data: setWidgetData,
                init: initWidget,

                dialog: plugin.dialogNames.fillInTheBlankDropDown,
                template:
                    '<' + widgetTag + ' class="' + classNames.blankField + ' ' + classNames.blankSelect + ' ' + classNames.newBlank + '">' +
                        '<' + widgetTag + ' class="' + classNames.blankValue + '">' +
                            '{selectedText}' +
                        '</' + widgetTag + '>' +
                        '<' + widgetTag + ' class="' + classNames.dropDownIndicator + '">' + plugin.spaceSymbol + '</' + widgetTag + '>' +
                        '<' + widgetTag + ' class="' + classNames.close + '">' + plugin.spaceSymbol + '</' + widgetTag + '>' +
                    '</' + widgetTag + '>',
                parts: {
                    blankValue: widgetTag + '.' + classNames.blankValue,
                    close: widgetTag + '.' + classNames.close
                },
                upcast: function (element, data) {
                    if (element.name === plugin.dataTags.fillInTheBlankDropDown && _.contains(element.classes, classNames.blankSelect)) {
                        data.dropDownValues = [];
                        element.children.forEach(function (item) {
                            var decodedValue = plugin.decodeString(item.attributes.value);
                            data.dropDownValues.push(decodedValue);
                            if (item.attributes.checked) {
                                data.blankValue = decodedValue;
                            }
                        });

                        var groupId = element.attributes[plugin.groupIdAttribute];

                        var blankFieldElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'data-group-id': groupId,
                            'class': classNames.blankField + ' ' + classNames.blankSelect
                        });

                        var blankValueElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'class': classNames.blankValue
                        });
                        blankFieldElement.add(blankValueElement);

                        var dropDownIndicator = new CKEDITOR.htmlParser.element(widgetTag, {
                            'class': classNames.dropDownIndicator
                        });
                        dropDownIndicator.add(new CKEDITOR.htmlParser.text(plugin.spaceSymbol));
                        blankFieldElement.add(dropDownIndicator);

                        var closeElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'class': classNames.close
                        });
                        closeElement.add(new CKEDITOR.htmlParser.text(plugin.spaceSymbol));
                        blankFieldElement.add(closeElement);

                        element.replaceWith(blankFieldElement);

                        return blankFieldElement;
                    }
                    return false;
                },
                downcast: function (element) {
                    if (element.hasClass(plugin.classNames.blankSelect)) {
                        var groupId = element.attributes[plugin.groupIdAttribute] || '';

                        var selectElement = new CKEDITOR.htmlParser.element(plugin.dataTags.fillInTheBlankDropDown, {
                            'data-group-id': groupId,
                            'class': plugin.classNames.blankSelect
                        });

                        var data = this.data;
                        data.dropDownValues.forEach(function (value) {
                            var optionDefinition = {
                                value: plugin.encodeString(value)
                            };
                            if (value === data.blankValue) {
                                optionDefinition.checked = 'checked';
                            }
                            var option = new CKEDITOR.htmlParser.element('option', optionDefinition);
                            option.add(new CKEDITOR.htmlParser.text(value));
                            selectElement.add(option);
                        });

                        return selectElement;
                    }
                    return false;
                }
            });
            //#endregion WIDGETS DEFINITION

        },

        onLoad: function () {
            CKEDITOR.document.appendStyleSheet(this.path + 'styles.css');
            CKEDITOR.dialog.add(this.dialogNames.fillInTheBlank, this.path + 'dialogs/fillInTheBlank.js');
            CKEDITOR.dialog.add(this.dialogNames.fillInTheBlankDropDown, this.path + 'dialogs/fillInTheBlankDropDown.js');
        }
    };

    CKEDITOR.plugins.add('fillintheblank', CKEDITOR.plugins.fillintheblank);
})();