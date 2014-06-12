(function () {

    var plugin = CKEDITOR.plugins.fillInTheBlank;
  
    CKEDITOR.dialog.add(plugin.fillInTheBlankDialogName, function (editor) {

        var
            lang = editor.lang.fillInTheBlank,

            dialogDefinition = {
                title: lang.popupTitle,
                minWidth: 400,
                minHeight: 70,
                resizable: CKEDITOR.DIALOG_RESIZE_NONE,
                contents: [
                {
                    id: 'info',
                    elements: [
                    {
                        id: 'blankValue',
                        type: 'text',
                        setup: function (widget) {
                            if (widget.data.selectedText) {
                                this.setValue(widget.data.selectedText ? widget.data.selectedText : widget.data.blankValue);
                            } else {
                                this.setValue(widget.data.blankValue);
                            }
                        },
                        commit: function(widget) {
                            if (widget.data.selectedText) {
                                delete widget.data.selectedText;
                            }
                            widget.setData('blankValue', this.getValue());
                        }
                    }
                    ]
                }]
            };

        return dialogDefinition;
    });

})();