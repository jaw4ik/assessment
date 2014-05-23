ko.bindingHandlers.fillInTheBlank = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var editorName = valueAccessor().name,
            createButtonSelector = valueAccessor().createButtonSelector,
            language = valueAccessor().language || 'en',
            eventTracker = valueAccessor().eventTracker || null;

        $(createButtonSelector, element).click(createBlank);

        function createBlank() {
            var editor = CKEDITOR.instances[editorName];
            editor.execCommand(CKEDITOR.plugins.fillInTheBlank.commands.addBlank);
        }
    },
    update: function (element, valueAccessor) {
    }
};