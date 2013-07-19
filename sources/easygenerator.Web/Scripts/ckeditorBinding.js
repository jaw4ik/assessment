ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var bindingArguments = valueAccessor();
        var editor = null;
        var language = bindingArguments.language() || 'en';
        var commandsToTrack = ['cut', 'copy', 'paste', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image'];

        CKEDITOR.domReady(initEditor);
        CKEDITOR.config.language = language;

        function initEditor() {
            editor = CKEDITOR.inline(element);
            editor.setData(bindingArguments.data());

            editor.on('instanceReady', function () {
                editor.focus();
                addCommandsTracking(editor, bindingArguments.eventTracker || null);
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
                editor.destroy();
            });
            
            function addCommandsTracking(editor, eventTracker) {
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
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};