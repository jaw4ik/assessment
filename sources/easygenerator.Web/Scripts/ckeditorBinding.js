ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var language = valueAccessor().language() || 'en',
            eventTracker = valueAccessor().eventTracker || null,
            data = valueAccessor().data,
            isEditing = valueAccessor().isEditing,
            saveHandler = valueAccessor().save,
            saveIntervalId = null,
            autosaveInterval = valueAccessor().autosaveInterval || 60000,
            that = bindingContext.$root;

        var $toolbarElement = null;

        var commandsToTrack = ['cut', 'copy', 'paste', 'pastetext', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image', 'mediaembed'];

        CKEDITOR.config.language = language;

        $(element).attr('contenteditable', true);
        var editor = CKEDITOR.inline(element);

        editor.on('instanceReady', function () {
            $toolbarElement = $('#cke_' + editor.name);

            addContentFilter();
            addCommandsTracking();

            if (data().length > 0) {
                editor.setData(data());
            }

            if (isEditing()) {
                editor.focus();

                var range = editor.createRange();
                range.moveToPosition(range.root, CKEDITOR.POSITION_BEFORE_END);
                editor.getSelection().selectRanges([range]);
            }

            editor.on('focus', function () {
                var toolbarTopPosition = editor.container.getDocumentPosition().y - $toolbarElement.height();
                $toolbarElement.css('top', toolbarTopPosition);
                isEditing(true);
            });

            editor.on('blur', function () {
                isEditing(false);
                saveData();
                clearInterval(saveIntervalId);
            });

            editor.on('key', function (event) {
                if (event.data.keyCode == 27)
                    editor.focusManager.blur();
            });

            editor.on('change', function () {
                data(editor.getData());
            });

            saveIntervalId = setInterval(saveData, autosaveInterval);
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (!!CKEDITOR.dialog._.currentTop)
                CKEDITOR.dialog._.currentTop.hide();

            saveData();

            editor.destroy(true);
            $(element).removeAttr('contenteditable');
        });

        function saveData() {
            if (!!saveHandler) {
                filterContent(editor.editable().$);
                data(editor.getData());
                saveHandler.call(that, viewModel);
            }
        }

        function addCommandsTracking() {
            if (!editor || !eventTracker)
                return;

            _.each(editor.commands, function (command) {
                if (commandsToTrack.indexOf(command.name) != -1) {
                    (function (cmd) {
                        var baseExec = cmd.exec;
                        cmd.exec = function (eventInfo) {
                            eventTracker.publish(cmd.name, 'CKEditor');
                            baseExec.call(cmd, eventInfo);
                        };
                    })(command);
                }
            });

            editor.on('publishEvent', function (eventInfo) {
                eventTracker.publish(eventInfo.data, 'CKEditor');
            });
        }

        function addContentFilter() {
            var widthRegExp = new RegExp("\s*width\s*:\s*([^;]*)", "g");
            var heightRegExp = new RegExp("\s*height\s*:\s*([^;]*)", "g");

            var rules = {
                elements: {
                    $: function (e) {
                        if (e.attributes.style) {
                            var width = e.attributes.style.match(widthRegExp) + ';';
                            var height = e.attributes.style.match(heightRegExp) + ';';
                            delete e.attributes.style;
                            e.attributes.style = width + height;
                        }

                        if (e.attributes.class) {
                            delete e.attributes.class;
                        }
                    }
                }
            };

            editor.dataProcessor.htmlFilter.addRules(rules);
            editor.dataProcessor.dataFilter.addRules(rules);
        }

        function isElementEmpty(e) {
            var $element = $(e);

            if (e.nodeType == 3 && $element.text().trim().length == 0) {
                return true;
            }

            if ($element.prop("tagName") != 'P') {
                return false;
            }

            if ($element.contents().length == 0) {
                return true;
            }

            return _.every($element.contents(), function (child) {
                return isElementEmpty(child);
            });
        }

        function filterContent(contentElement) {
            var $content = $(contentElement);

            $content.find('br').each(function (index, brElement) {
                brElement.remove();
            });

            $content.find('style').each(function (index, styleElement) {
                styleElement.remove();
            });

            var isContentEmpty = _.every($content.contents(), function (child) {
                return isElementEmpty(child);
            });

            if (isContentEmpty) {
                $content.empty();
            }

        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};