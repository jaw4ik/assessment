define(['knockout'], function (ko) {

    ko.bindingHandlers.fillInTheBlank = {
        init: function (element, valueAccessor) {

            var editorName = valueAccessor().name,
                createButtonSelectors = valueAccessor().createButtonSelectors,
                language = valueAccessor().language || 'en',
                eventTracker = valueAccessor().eventTracker || null;

            if (!_.isNullOrUndefined(createButtonSelectors.addBlank)) {
                $(createButtonSelectors.addBlank, element).click(function () {
                    createBlank(CKEDITOR.plugins.fillintheblank.commands.addBlank);
                });
            }

            if (!_.isNullOrUndefined(createButtonSelectors.addDropDownBlank)) {
                $(createButtonSelectors.addDropDownBlank, element).click(function () {
                    createBlank(CKEDITOR.plugins.fillintheblank.commands.addDropDownBlank);
                });
            }

            function createBlank(command) {
                var editor = CKEDITOR.instances[editorName];
                if (!editor.focusManager.hasFocus) {
                    var range = editor.createRange();
                    range.moveToElementEditablePosition(editor.editable(), true);

                    editor.getSelection().selectRanges([range]);
                }
                editor.execCommand(command);
            }
        }
    };

})