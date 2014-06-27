ko.bindingHandlers.fillInTheBlank = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var editorName = valueAccessor().name,
            createButtonSelector = valueAccessor().createButtonSelector,
            language = valueAccessor().language || 'en',
            eventTracker = valueAccessor().eventTracker || null,
            editor = CKEDITOR.instances[editorName];

        $(createButtonSelector, element).click(createBlank);
        
        function createBlank() {
            if (!editor.focusManager.hasFocus) {
                var range = editor.createRange();
                range.moveToElementEditablePosition(editor.editable(), true);

                editor.getSelection().selectRanges([range]);
            }
            editor.execCommand(CKEDITOR.plugins.fillInTheBlank.commands.addBlank);
        }
    },
    update: function (element, valueAccessor) {
    }
};