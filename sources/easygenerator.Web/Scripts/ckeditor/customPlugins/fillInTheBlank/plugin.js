(function () {

    CKEDITOR.plugins.fillInTheBlank = {
        requires: 'widget',
        lang: 'en',
        commands: {
            addBlank: 'addBlank'
        },
        dataTag: 'input',
        classNames: {
            blankInput: 'blankInput',
            blankField: 'blankField',
            blankWrapper: 'blankWrapper',
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

            CKEDITOR.dtd.$editable.span = 1;
            var plugin = CKEDITOR.plugins.fillInTheBlank;
            var classNames = plugin.classNames;
            var widgetTag = plugin.widgetTag;

            if (editor.contextMenu) {
                editor.contextMenu.addListener(function (element, selection) {
                    var $element = $(element.$);
                    if ($element.hasClass(classNames.blankValue)) {
                        var range = selection.getRanges()[0];
                        caretPositionForPaste = {
                            start: range.startOffset,
                            end: range.endOffset
                        };
                    }
                });
            }

            editor.on('pasteDialogCommit', function (evt) {
                var $editable = $(editor.element.$).find('.' + classNames.cke_focused);
                if (evt.data && $editable.length == 1) {
                    var data = evt.data.replace(/(<([^>]+)>)/ig, '').replace(/(&nbsp;)/g, ' ');
                    $editable.trigger('paste', data);
                    evt.cancel();
                }
            });

            editor.on('paste', function (evt) {
                var $data = $('<output>').append($.parseHTML(evt.data.dataValue));
                $('.' + classNames.blankField, $data).removeAttr('data-group-id');
                evt.data.dataValue = $data.html();

                //region "paste for IE"
                var $editable = $(editor.element.$).find('.' + classNames.cke_focused);
                if (CKEDITOR.env.ie && $editable.length == 1) {
                    $editable.trigger('paste');
                    evt.cancel();
                }
                //endregion "paste for IE"
            });
            editor.widgets.add(plugin.commands.addBlank, {
                draggable: false,
                defaults: function () {
                    var selectedContent = '';
                    var selection = editor.getSelection();
                    if (selection != null && selection.getType() == CKEDITOR.SELECTION_TEXT) {
                        selectedContent = selection.getSelectedText();
                    } else if (selection != null && selection.getType() == CKEDITOR.SELECTION_ELEMENT) {
                        selectedContent = selection.getSelectedElement().getText();
                    }
                    return { text: selectedContent };
                },
                template: '<' + widgetTag + ' class="' + classNames.blankField + ' new" id="">' +
                    '<' + widgetTag + ' class="' + classNames.blankWrapper + '">' +
                    '<' + widgetTag + ' class="' + classNames.blankValue + '">' +
                    '{text}' +
                    '</' + widgetTag + '>' +
                    '</' + widgetTag + '>' +
                    '<' + widgetTag + ' class="' + classNames.close + '">' +
                    '&nbsp;' +
                    '</' + widgetTag + '>' +
                    '</' + widgetTag + '>',
                editables: {
                    content: {
                        selector: widgetTag + '.' + classNames.blankValue,
                        allowedContent: '!br strong b i em'
                    }
                },
                upcast: function (element, data) {
                    if (element.name === plugin.dataTag && _.contains(element.classes, classNames.blankInput)) {
                        var value = element.attributes.value;
                        var groupId = element.attributes['data-group-id'];

                        var blankFieldElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'data-group-id': groupId,
                            class: classNames.blankField,
                            contenteditable: false
                        });

                        var blankWrapperElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            class: classNames.blankWrapper,
                            contenteditable: false
                        });
                        blankFieldElement.add(blankWrapperElement);

                        var blankValueElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            class: classNames.blankValue
                        });
                        blankValueElement.add(new CKEDITOR.htmlParser.text(value));
                        blankWrapperElement.add(blankValueElement);

                        var closeElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            class: classNames.close,
                            contenteditable: false
                        });
                        blankFieldElement.add(closeElement);


                        element.replaceWith(blankFieldElement);
                        return blankFieldElement;
                    }
                },
                init: function () {
                    var widget = this;
                    var element = this.element;
                    var $editable = $('.' + plugin.classNames.blankValue, widget.element.$);
                    $('.' + plugin.classNames.close, element.$).on('click', function (event) {

                        _.defer(function () {
                            widget.repository.del(widget);
                            widget.fire(plugin.events.removeBlank);
                            editor.fire('change');
                        });

                        event.preventDefault();
                        event.stopPropagation();
                    });

                    widget.on('ready', function () {
                        $editable.on('keydown', function (event) {
                            var keyCode = event.keyCode;

                            if (keyCode == 13) {
                                $editable.blur();

                                event.preventDefault();
                                event.stopPropagation();
                                return;
                            }

                            //region "paste for IE"
                            var ctrlKey = event.ctrlKey;
                            if (CKEDITOR.env.ie && ctrlKey && keyCode == 86) {
                                caretPositionForPaste = getCaretPosition($editable[0]);
                            }
                            //endregion "paste for IE"

                            if (widget.element.hasClass(plugin.classNames.new)) {
                                var char = String.fromCharCode(keyCode);

                                if (!/^[A-Za-z][A-Za-z0-9 -]*$/.test(char)) {
                                    return;
                                }

                                if (event.shiftKey === false) {
                                    char = char.toLowerCase();
                                }
                                $editable.text(char);
                                widget.element.removeClass(plugin.classNames.new);
                                setCaretPosition($editable[0], 1);

                                event.preventDefault();
                                event.stopPropagation();
                            }
                        });
                    });

                    $editable.on('paste', function (evt, dataFromPasteDialog) {
                        var caretPositions = null;
                        //region "paste for IE"
                        if (CKEDITOR.env.ie || dataFromPasteDialog) {
                            caretPositions = caretPositionForPaste;
                        } else {
                            caretPositions = getCaretPosition($editable[0]);
                        }
                        //endregion "paste for IE"
                        var clipboardData = evt.originalEvent ? evt.originalEvent.clipboardData : window.clipboardData;
                        var data = dataFromPasteDialog ? dataFromPasteDialog : clipboardData ? clipboardData.getData('text') : '';
                        _.defer(function () {
                            var text = $editable.text();
                            if (text == '') {
                                $editable.text(data);
                                setCaretPosition($editable[0], data.length);
                            } else {
                                text = text.substring(0, caretPositions.start) + data + text.substring(caretPositions.end, text.length);
                                $editable.text(text);
                                setCaretPosition($editable[0], caretPositions.start + data.length);
                            }
                            editor.fire('change');
                        });

                        evt.preventDefault();
                        evt.stopPropagation();
                    });

                    $editable.on('focus', function () {
                        widget.addClass('focused');
                    });
                    $editable.on('blur', function () {
                        widget.removeClass('focused');
                    });
                    if (element.hasClass(plugin.classNames.new)) { //focus on create
                        widget.on('ready', function () {
                            var $widgetElement = $(widget.element.$);
                            $widgetElement.parent().after('&#8203;');
                            _.defer(function () {
                                $editable.focus();
                            });
                        });
                    }
                },
                downcast: function (element, data) {
                    if (element.hasClass(plugin.classNames.blankField)) {
                        var value = '';
                        var groupId = element.attributes['data-group-id'];
                        for (var wrapperIndex in element.children) {
                            if (element.children[wrapperIndex].hasClass(plugin.classNames.blankWrapper)) {
                                var wrapperElement = element.children[wrapperIndex];
                                for (var index in wrapperElement.children) {
                                    if (wrapperElement.children[index].hasClass(plugin.classNames.blankValue)) {
                                        value = wrapperElement.children[index].getHtml();
                                    }
                                }
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

    function getCaretPosition(element) {
        var caretPos = {
            start: 0,
            end: 0
        };
        if (window.getSelection) {
            var selection = window.getSelection();
            if (selection.rangeCount) {
                var range = selection.getRangeAt(0);
                if (range.commonAncestorContainer.parentNode == element) {
                    caretPos.end = range.endOffset;
                    caretPos.start = range.startOffset;
                }
            }
        }
        return caretPos;
    }

    function setCaretPosition(element, position) {
        if (window.getSelection) {
            var selection = window.getSelection(),
                child = element.lastChild,
                range = document.createRange();
            if (child.length < position) {
                range.setStart(child, child.length);
            } else {
                range.setStart(child, position);
            }
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            element.focus();
        }
    }

})();