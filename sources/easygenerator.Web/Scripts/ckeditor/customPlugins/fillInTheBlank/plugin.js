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
            blankValue: 'blankValue',
            close: 'close',
            new: 'new'
        },
        events: {
            removeBlank: 'removeEditable'
        },
        widgetTag: 'span',
        init: function (editor) {
            CKEDITOR.dtd.$editable.span = 1;
            var plugin = CKEDITOR.plugins.fillInTheBlank;
            var classNames = plugin.classNames;
            var widgetTag = plugin.widgetTag;
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
                    if (selection != null && selection.getType() == CKEDITOR.SELECTION_TEXT) {
                        selectedContent = selection.getSelectedText();
                    }
                    return { text: selectedContent };
                },
                template: '<' + widgetTag + ' class="' + classNames.blankField + ' new" id="">' +
                    '<' + widgetTag + ' class="' + classNames.blankValue + '">' +
                    '{text}' +
                    '</' + widgetTag + '>' +
                    '<' + widgetTag + ' class="' + classNames.close + '">' +
                    '&nbsp;' +
                    '</' + widgetTag + '>' +
                    '</' + widgetTag + '>',
                editables: {
                    content: {
                        selector: widgetTag + '.' + classNames.blankValue,
                        allowedContent: '!br'
                    }
                },
                upcast: function (element, data) {
                    if (element.name === plugin.dataTag && _.contains(element.classes, classNames.blankInput)) {
                        var value = element.attributes.value;
                        var groupId = element.attributes['data-group-id'];

                        var blankFieldElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            'data-group-id': groupId,
                            class: classNames.blankField
                        });

                        var blankValueElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            class: classNames.blankValue
                        });
                        blankValueElement.add(new CKEDITOR.htmlParser.text(value));
                        blankFieldElement.add(blankValueElement);

                        var closeElement = new CKEDITOR.htmlParser.element(widgetTag, {
                            class: classNames.close
                        });
                        closeElement.add(new CKEDITOR.htmlParser.text('&nbsp;'));
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
                        widget.editables.content.on('keydown', function (event) {
                            var keyCode = event.data.getKey();

                            if (keyCode == 13) {
                                $editable.blur();

                                event.data.preventDefault();
                                event.data.stopPropagation();
                            }
                        });
                    });

                    $editable.on('paste', function (evt) {
                        var caretPositions = getCaretPosition($editable[0]);
                        var clipboardData = evt.originalEvent ? evt.originalEvent.clipboardData : window.clipboardData;//evt.data.$.view ? evt.data.$.view.clipboardData : evt.data.$.clipboardData;
                        var data = clipboardData.getData('text');
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
                        for (var index in element.children) {
                            if (element.children[index].hasClass(plugin.classNames.blankValue)) {
                                value = element.children[index].getHtml();
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