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

    config.extraPlugins = 'semanticTagsPlugin';
    config.extraAllowedContent = 'iframe';

    config.removeFormatTags = 'b,big,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var,abbr,acronym,blockquote,cite,mark,figcaption,time';

    config.startupOutlineBlocks = true;
    config.title = false;
    config.autoParagraph = false;
    
    config.commandsToTrack = ['cut', 'copy', 'paste', 'pastetext', 'undo', 'redo', 'bold', 'italic',
            'underline', 'removeformat', 'numberedlist', 'bulletedlist', 'link', 'unlink', 'table', 'image', 'mediaembed'];

    config.magicline_color = '#aeb3b9';
};
