(function () {

    var plugin = CKEDITOR.plugins.mediaembed;


    CKEDITOR.dialog.add(plugin.dialogName, function (editor) {
        var lang = editor.lang.mediaembed;
        return {
            title: lang.embedMedia,
            minWidth: 550,
            minHeight: 200,
            contents: [{
                id: 'iframe',
                expand: true,
                elements: [
                {
                    type: 'addVideoFromLibraryButton',
                    id: 'addVideoFromLibrary',
                    embedCodeAreaId: 'embedArea',
                    parentContainerId: 'iframe'
                },
                {
                    id: 'embedArea',
                    type: 'textarea',
                    label: lang.pasteEmbedCodeHere,
                    onChange: function () {
                        editor.execCommand(plugin.commands.editCode);
                    },
                    autofocus: 'autofocus',
                    validate: CKEDITOR.dialog.validate.notEmpty(lang.embedCodeMissing)
                }]
            }],
            onOk: function () {
                var div = editor.document.createElement('div');
                div.setHtml(this.getContentElement('iframe', 'embedArea').getValue());
                editor.insertElement(div);
                editor.execCommand(plugin.commands.pasteCode);
            }
        };
    });
})();