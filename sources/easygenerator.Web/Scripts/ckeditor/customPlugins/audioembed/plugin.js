(function () {

    CKEDITOR.plugins.audioembed = {

        icons: 'audioembed',
        lang: 'en,uk,zh-cn,pt-br',

        commands: {
            openDialog: 'audioEmbedOpenDialog',
            editCode: 'audioEmbedEditCode',
            pasteCode: 'audioEmbedPasteCode'
        },
        dialogName: 'audioEmbedDialog',

        init: function (editor) {
            var lang = editor.lang.audioembed;

            editor.addCommand(this.commands.openDialog, new CKEDITOR.dialogCommand(this.dialogName,
                {
                    allowedContent: 'iframe[*]',
                    requiredContent: 'iframe[*]'
                }
            ));

            editor.ui.addButton('AudioEmbed', {
                label: lang.embedAudio,
                command: this.commands.openDialog,
                toolbar: 'audioembed'
            });

            //Adding tracking commands
            editor.addTrackingCommand(this.commands.openDialog, 'Open "Embed audio" dialog');
            editor.addTrackingCommand(this.commands.editCode, 'Edit code in "Embed audio"');
            editor.addTrackingCommand(this.commands.pasteCode, 'Paste embedded audio');
        },

        onLoad: function () {
            CKEDITOR.dialog.add(this.dialogName, this.path + 'dialogs/audioembed.js');
        }
    };

    CKEDITOR.plugins.add('audioembed', CKEDITOR.plugins.audioembed);
})();
