ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var language = valueAccessor().language() || 'en',
            eventTracker = valueAccessor().eventTracker || null,
            data = valueAccessor().data,
            isEditing = valueAccessor().isEditing;

        var $el = $(element);

        var subscribers = {
            focusSubscriber: null,
            blurSubscriber: null,
            keySubscriber: null,
            changeSubscriber: null
        };

        var commandsToTrack = ['cut', 'copy', 'paste', 'pastetext', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image', 'mediaembed'];

        CKEDITOR.config.language = language;

        $el.attr('contenteditable', true);
        var editor = CKEDITOR.inline(element);

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

            subscribers.focusSubscriber = editor.on('focus', function () {
                isEditing(true);
            });

            subscribers.blurSubscriber = editor.on('blur', function () {
                isEditing(false);
            });

            subscribers.keySubscriber = editor.on('key', function (event) {
                if (event.data.keyCode == 27)
                    editor.focusManager.blur();
            });

            subscribers.changeSubscriber = editor.on('change', function () {
                data(editor.getData());
            });
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (!!CKEDITOR.dialog._.currentTop)
                CKEDITOR.dialog._.currentTop.hide();

            for (var subscriber in subscribers)
                subscribers[subscriber].removeListener();

            editor.setData('');
            editor.destroy(true);
            $el.removeAttr('contenteditable');
        });

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