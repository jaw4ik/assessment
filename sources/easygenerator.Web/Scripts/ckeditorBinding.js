ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var
            language = valueAccessor().language() || 'en',
            eventTracker = valueAccessor().eventTracker || null,
            data = valueAccessor().data,
            isEditing = valueAccessor().isEditing;

        var $el = $(element);

        var commandsToTrack = ['cut', 'copy', 'paste', 'pastetext', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image'];

        CKEDITOR.config.language = language;

        $el.attr({ 'contenteditable': true });
        var editor = CKEDITOR.inline(element);
        editor.publishEvent = publishEditorEvent;
        editor.element.$.title = '';

        editor.on('instanceReady', function () {
            addContentFilter();
            addCommandsTracking();

            if (data().length > 0) {
                editor.setData(data());
            } else {
                editor.setData('<p></p>');
            }

            if (isEditing())
                editor.focus();

            editor.on('focus', function () {
                isEditing(true);
            });

            editor.on('blur', function () {
                isEditing(false);
            });

            editor.on('key', function (event) {
                if (event.data.keyCode == 27)
                    editor.focusManager.blur();
            });

            editor.on('change', function () {
                data(editor.getData());
            });
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (!!CKEDITOR.dialog._.currentTop)
                CKEDITOR.dialog._.currentTop.hide();

            editor.destroy();
            $el.attr({ 'contenteditable': false });
        });

        function addCommandsTracking() {
            _.each(editor.commands, function (command) {
                if (commandsToTrack.indexOf(command.name) != -1) {
                    (function (cmd) {
                        var baseExec = cmd.exec;
                        cmd.exec = function (data) {
                            editor.publishEvent(cmd.name);
                            baseExec.call(cmd, data);
                        };
                    })(command);
                }
            });
        }

        function publishEditorEvent(event) {
            if (!editor || !eventTracker)
                return;

            eventTracker.publish(event, 'CKEditor');
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