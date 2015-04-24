(function () {

    var plugin = CKEDITOR.plugins.audioembed;

    CKEDITOR.dialog.add(plugin.dialogName, function (editor) {
        var lang = editor.lang.audioembed;

        return {
            title: lang.embedAudio,
            minWidth: 550,
            minHeight: 200,
            contents: [{
                id: 'iframe',
                expand: true,
                elements: [
                {
                    type: 'html',
                    html: lang.dialogDescriptionContent
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