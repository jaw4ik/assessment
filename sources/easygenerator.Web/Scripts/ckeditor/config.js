CKEDITOR.disableAutoInline = true;

CKEDITOR.editorConfig = function (config) {
    config.skin = 'moono';

    config.toolbar = [
        ['Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', '-', 'RemoveFormat'],
        ['NumberedList', 'BulletedList'],
        ['Link', 'Unlink', 'Table', 'Image', 'Iframe', 'MediaEmbed'],
        ['semanticTags']
    ];

    CKEDITOR.plugins.addExternal('semanticTagsPlugin', CKEDITOR.basePath + 'customPlugins/semanticTagsPlugin/', 'plugin.js');
    config.contentsCss = CKEDITOR.basePath + 'customPlugins/semanticTagsPlugin/styles.css';
    
    CKEDITOR.plugins.addExternal('fileUploaderPlugin', CKEDITOR.basePath + 'customPlugins/fileUploaderPlugin/', 'plugin.js');
    CKEDITOR.plugins.addExternal('image', CKEDITOR.basePath + 'customPlugins/image/', 'plugin.js');
    CKEDITOR.plugins.addExternal('floatingspace', CKEDITOR.basePath + 'customPlugins/floatingspace/', 'plugin.js');
    CKEDITOR.plugins.addExternal('mediaembed', CKEDITOR.basePath + 'customPlugins/mediaembed/', 'plugin.js');
    CKEDITOR.plugins.addExternal('imageLibraryPlugin', CKEDITOR.basePath + 'customPlugins/imageLibraryPlugin/', 'plugin.js');
    CKEDITOR.plugins.addExternal('fillInTheBlank', CKEDITOR.basePath + 'customPlugins/fillInTheBlank/', 'plugin.js');

    config.extraPlugins = 'semanticTagsPlugin,fileUploaderPlugin,image,floatingspace,mediaembed,imageLibraryPlugin,fillInTheBlank';
    config.extraAllowedContent = 'iframe';

    config.removeFormatTags = 'big,del,font,ins,kbd,s,small,strike,tt,var,figcaption,em,strong,u,abbr,acronym,blockquote,q,cite,dfn,code,samp,sub,sup,mark,time';

    config.startupOutlineBlocks = true;
    config.title = false;
    config.autoParagraph = false;
    
    config.commandsToTrack = ['cut', 'copy', 'paste', 'pastetext', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image', 'mediaembed'];

    config.magicline_color = '#aeb3b9';

    config.baseFloatZIndex = 200;
    config.dialog_noConfirmCancel = true;
};

CKEDITOR.on('dialogDefinition', function (ev) {
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;

    if (dialogName == 'link') {
        var linkTargetType = dialogDefinition.getContents('target').get('linkTargetType');

        linkTargetType['setup'] = function (data) {
            if (data.target) {
                this.setValue(data.target.type || '_blank');
            } else {
                this.setValue('_blank');
            }
            linkTargetType['onChange'].call(this);
        };
    }
    else if (dialogName == 'table' || dialogName == 'tableProperties') {
        dialogDefinition.getContents('info').remove('txtSummary');
        dialogDefinition.getContents('info').remove('txtBorder');
        dialogDefinition.getContents('info').remove('txtCellSpace');
        dialogDefinition.getContents('info').remove('txtCellPad');
    }
});