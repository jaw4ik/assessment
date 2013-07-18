ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var bindingArguments = valueAccessor();
        var editor = undefined;
        var language = bindingArguments.language() || 'en';

        CKEDITOR.domReady(initEditor);
        CKEDITOR.config.language = language;

        function initEditor() {
            editor = CKEDITOR.inline(element);
            editor.setData(bindingArguments.data());
            
            editor.on('instanceReady', function () {
                editor.focus();
            });
            
            editor.on(bindingArguments.endEditingEvent, function () {
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
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};