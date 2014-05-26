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
            editor.widgets.add(plugin.commands.addBlank, {
                draggable: false,
                defaults: function () {
                    var selectedContent = ' ';
                    var selection = editor.getSelection();
                    if (selection != null && selection.getType() == CKEDITOR.SELECTION_TEXT) {
                        selectedContent = selection.getSelectedText();
                    }
                    if (selectedContent === '') {
                        selectedContent = ' ';
                    }
                    return { text: selectedContent };
                },
                template: '<' + CKEDITOR.plugins.fillInTheBlank.widgetTag + ' class="' + CKEDITOR.plugins.fillInTheBlank.classNames.blankField + ' new" id=""><' + CKEDITOR.plugins.fillInTheBlank.widgetTag + ' class="' + CKEDITOR.plugins.fillInTheBlank.classNames.blankValue + '">{text}</' + CKEDITOR.plugins.fillInTheBlank.widgetTag + '><' + CKEDITOR.plugins.fillInTheBlank.widgetTag + ' class="' + CKEDITOR.plugins.fillInTheBlank.classNames.close + '">&nbsp;</' + CKEDITOR.plugins.fillInTheBlank.widgetTag + '></' + CKEDITOR.plugins.fillInTheBlank.widgetTag + '>',
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
                        if (value != '') {
                            return new CKEDITOR.htmlParser.element(plugin.dataTag, {
                                'data-group-id': groupId != undefined ? groupId : '',
                                value: value,
                                class: plugin.classNames.blankInput

                            });
                        }
                        return new CKEDITOR.htmlParser.text('');
                    }
                }
            });

        }
    };
    CKEDITOR.plugins.add('fillInTheBlank', CKEDITOR.plugins.fillInTheBlank);
    CKEDITOR.document.appendStyleSheet(CKEDITOR.plugins.fillInTheBlank.path + 'styles.css');

})();