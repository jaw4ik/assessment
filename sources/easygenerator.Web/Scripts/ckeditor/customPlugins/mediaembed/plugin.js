/*
* Embed Media Dialog based on http://www.fluidbyte.net/embed-youtube-vimeo-etc-into-ckeditor
*
* Plugin name:      mediaembed
* Menu button name: MediaEmbed
*
* Youtube Editor Icon
* http://paulrobertlloyd.com/
*
* @author Yuriy Savchuk =)
* @version 0.6
*/

(function () {

    CKEDITOR.plugins.mediaembed = {

        icons: 'mediaembed',
        hidpi: true,
        lang: 'en,uk,zh-cn,pt-br,de,nl',

        commands: {
            openDialog: 'mediaEmbedOpenDialog',
            editCode: 'mediaEmbedEditCode',
            pasteCode: 'mediaEmbedPasteCode'
        },
        dialogName: 'mediaEmbedDialog',

        init: function (editor) {
            var lang = editor.lang.mediaembed;

            editor.addCommand(this.commands.openDialog, new CKEDITOR.dialogCommand(this.dialogName,
                {
                    allowedContent: 'iframe[*]',
                    requiredContent: 'iframe[*]'
                }
            ));

            editor.ui.addButton('MediaEmbed', {
                label: lang.embedMedia,
                command: this.commands.openDialog,
                toolbar: 'mediaembed'
            });

            //Adding tracking commands
            editor.addTrackingCommand(this.commands.openDialog, 'Open "Embed media" dialog');
            editor.addTrackingCommand(this.commands.editCode, 'Edit code in "Embed media"');
            editor.addTrackingCommand(this.commands.pasteCode, 'Paste embedded media');
        },

        onLoad: function () {
            CKEDITOR.dialog.add(this.dialogName, this.path + 'dialogs/mediaembed.js');
            CKEDITOR.document.appendStyleSheet(this.path + 'styles.css');
        }
    };

    CKEDITOR.plugins.add('mediaembed', CKEDITOR.plugins.mediaembed);

})();