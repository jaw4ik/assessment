ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var bindingArguments = valueAccessor();
        var editor = null;
        var language = bindingArguments.language() || 'en';
        var $el = $(element);
        var commandsToTrack = ['cut', 'copy', 'paste', 'pastetext', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image'];

        CKEDITOR.disableAutoInline = true;
        CKEDITOR.config.language = language;

        $el.html(bindingArguments.data());

        $el.on('click', function () {
            if (!bindingArguments.isEditing())
                startEdit();
        });

        if (bindingArguments.isEditing()) {
            startEdit();
        }

        function endEdit() {
            bindingArguments.isEditing(false);
            destroyEditor();
        }

        function startEdit() {
            bindingArguments.isEditing(true);

            $el.attr({ 'contenteditable': true });
            editor = CKEDITOR.inline(element);
            editor.focusManager.lock();

            editor.on('instanceReady', function () {
                addContentFilter();
                editor.element.$.title = '';
                addCommandsTracking(bindingArguments.eventTracker || null);

                if (editor.getData() == '')
                    editor.setData('<p></p>');
                editor.focusManager.unlock();
                setCaretToStartPosition();
                editor.focus();
            });

            editor.on('change', function () {
                updateData();
            });

            editor.on('blur', function () {
                endEdit();
            });

            editor.on('key', function (event) {
                if (event.data.keyCode == 27)
                    editor.focusManager.blur();
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                destroyEditor();
            });
        }

        function setCaretToStartPosition() {
            var elem = editor.document.getBody();

            var range = editor.createRange();
            if (range) {
                range.moveToElementEditablePosition(elem, false);
                range.select();
            }
        }

        function destroyEditor() {
            if (!!CKEDITOR.dialog._.currentTop)
                CKEDITOR.dialog._.currentTop.hide();

            editor.destroy();
            $el.attr({ 'contenteditable': false });
        }

        function updateData() {
            bindingArguments.data(editor.getData());
        }

        function addCommandsTracking(eventTracker) {
            if (!editor || !eventTracker)
                return;

            _.each(editor.commands, function (command) {
                if (commandsToTrack.indexOf(command.name) != -1) {
                    (function (cmd) {
                        var baseExec = cmd.exec;
                        cmd.exec = function (data) {
                            eventTracker.publish(cmd.name, 'CKEditor');
                            baseExec.call(cmd, data);
                        };
                    })(command);
                }
            });
        }

        function addContentFilter() {
            var rules = {
                elements: {
                    $: function (e) {
                        if (e.attributes.style) {
                            delete e.attributes.style;
                        }

                        if (e.attributes.class) {
                            delete e.attributes.class;
                        }

                        if (e.name == 'style') {
                            delete e;
                        }
                    }
                }
            };

            editor.dataProcessor.htmlFilter.addRules(rules);
            editor.dataProcessor.dataFilter.addRules(rules);
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};