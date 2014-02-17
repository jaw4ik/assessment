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

    config.extraPlugins = 'semanticTagsPlugin,fileUploaderPlugin,image,floatingspace,mediaembed,imageLibraryPlugin';
    config.extraAllowedContent = 'iframe';

    config.removeFormatTags = 'big,code,del,dfn,font,ins,kbd,q,s,samp,small,span,strike,tt,var,abbr,acronym,blockquote,cite,mark,figcaption,time';

    config.startupOutlineBlocks = true;
    config.title = false;
    config.autoParagraph = false;
    
    config.commandsToTrack = ['cut', 'copy', 'paste', 'pastetext', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image', 'mediaembed'];

    config.magicline_color = '#aeb3b9';

    config.baseFloatZIndex = 200;
    config.dialog_noConfirmCancel = true;
};