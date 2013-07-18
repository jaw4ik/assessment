ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var bindingArguments = valueAccessor();
        var editor = undefined;
        var intervalId = '';
        var language = require('localization/localizationManager').currentLanguage || 'en';

        CKEDITOR.domReady(initEditor);
        CKEDITOR.config.language = language;

        function initEditor() {
            editor = CKEDITOR.inline(element);
            editor.setData(bindingArguments.data());
            
            editor.on('instanceReady', function () {
                editor.focus();
            });
            
            editor.on(bindingArguments.endEditingEvent, function () {
                endEditing();
            });
            
            editor.on('key', function (event) {
                if (event.data.keyCode == 27)
                    editor.focusManager.blur();
            });

            intervalId = setInterval(function () {
                if (bindingArguments.data() !== editor.getData())
                    bindingArguments.data(editor.getData());
            }, 100);
            
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                clearInterval(intervalId);
                editor.destroy();
            });
            
            function endEditing() {
                bindingArguments.data(editor.getData());
                clearInterval(intervalId);
                editor.destroy();
                bindingArguments.onEndEditing(bindingContext.$data);
            }
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};