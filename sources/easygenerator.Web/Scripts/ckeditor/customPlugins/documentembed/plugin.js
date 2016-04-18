(function () {

    CKEDITOR.plugins.documentembed = {

        icons: 'documentembed',
        lang: 'en,uk,zh-cn,pt-br,de,nl,es,it',

        commands: {
            openDialog: 'documentEmbedOpenDialog',
            editCode: 'documentEmbedEditCode',
            pasteCode: 'documentEmbedPasteCode'
        },
        dialogName: 'doumentEmbedDialog',

        init: function (editor) {
            var lang = editor.lang.documentembed;

            editor.addCommand(this.commands.openDialog, new CKEDITOR.dialogCommand(this.dialogName,
                {
                    allowedContent: 'iframe[*]',
                    requiredContent: 'iframe[*]'
                }
            ));

            editor.ui.addButton('DocumentEmbed', {
                label: lang.ebmedDocument,
                command: this.commands.openDialog,
                toolbar: 'documentembed'
            });

            //Adding tracking commands
            editor.addTrackingCommand(this.commands.openDialog, 'Open "Embed document" dialog');
            editor.addTrackingCommand(this.commands.editCode, 'Edit code in "Embed document"');
            editor.addTrackingCommand(this.commands.pasteCode, 'Paste embedded document');
        },
        onLoad: function () {
            CKEDITOR.dialog.add(this.dialogName, this.path + 'dialogs/documentembed.js');
            CKEDITOR.document.appendStyleSheet(this.path + 'styles.css');
        }
    };

    CKEDITOR.plugins.add('documentembed', CKEDITOR.plugins.documentembed);
})();
