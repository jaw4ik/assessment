(function () {

    var plugin = CKEDITOR.plugins.fillintheblank;
  
    CKEDITOR.dialog.add(plugin.dialogNames.fillInTheBlank, function (editor) {

        var
            lang = editor.lang.fillintheblank,

            dialogDefinition = {
                title: lang.popupTitle,
                minWidth: 400,
                minHeight: 70,
                resizable: CKEDITOR.DIALOG_RESIZE_NONE,
                onShow: function () {
                    editor.fire(plugin.events.addBlank);
                },
                contents: [
                {
                    id: 'info',
                    elements: [
                    {
                        id: 'blankValue',
                        type: 'text',
                        setup: function (widget) {
                            if (widget.data.selectedText) {
                                this.setValue(widget.data.selectedText.trim(plugin.spaceSymbol));
                            } else {
                                this.setValue(widget.data.blankValue);
                            }
                        },
                        commit: function(widget) {
                            if (widget.data.selectedText) {
                                widget.setData('selectedText', null);
                            }
                            widget.setData('blankValue', this.getValue().trim());
                        }
                    }
                    ]
                }]
            };

        return dialogDefinition;
    });

})();