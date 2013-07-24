ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var bindingArguments = valueAccessor();
        var editor = null;
        var language = bindingArguments.language() || 'en';
        var saveIntervalId = '';

        var commandsToTrack = ['cut', 'copy', 'paste', 'pastetext', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image'];

        CKEDITOR.disableAutoInline = true;
        CKEDITOR.domReady(initEditor);
        CKEDITOR.config.language = language;

        function initEditor() {
            $(element).attr({ 'contenteditable': true });

            editor = CKEDITOR.inline(element);
            editor.setData(bindingArguments.data());

            editor.on('instanceReady', function () {
                addContentFilter();
                editor.focus();

                editor.element.$.title = '';
                addCommandsTracking(bindingArguments.eventTracker || null);

                saveIntervalId = setInterval(function () {
                    if (editor.getData() != bindingArguments.data())
                        bindingArguments.data(editor.getData());
                }, 60000);
            });

            editor.on('blur', function () {
                bindingArguments.data(editor.getData());
                bindingArguments.onEndEditing(bindingContext.$data);
            });

            editor.on('key', function (event) {
                if (event.data.keyCode == 27)
                    editor.focusManager.blur();
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                if (!!CKEDITOR.dialog._.currentTop)
                    CKEDITOR.dialog._.currentTop.hide();
                editor.destroy();
                clearInterval(saveIntervalId);
            });

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
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};