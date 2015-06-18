CKEDITOR.disableAutoInline = true;

CKEDITOR.editorConfig = function (config) {
    config.skin = 'moono';

    config.toolbar = [
        ['Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo'],
        ['Bold', 'Italic', 'Underline', '-', 'RemoveFormat'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['NumberedList', 'BulletedList'],
        ['Link', 'Unlink', 'Table', 'Image', 'Iframe', 'AudioEmbed', 'MediaEmbed', 'EqnEditor'],
        ['semanticTags']
    ];

    CKEDITOR.plugins.addExternal('justify', 'customPlugins/justify/');
    CKEDITOR.plugins.addExternal('semantictags', 'customPlugins/semantictags/');
    CKEDITOR.plugins.addExternal('fileuploader', 'customPlugins/fileuploader/');
    CKEDITOR.plugins.addExternal('image', 'customPlugins/image/');
    CKEDITOR.plugins.addExternal('floatingspace', 'customPlugins/floatingspace/');
    CKEDITOR.plugins.addExternal('mediaembed', 'customPlugins/mediaembed/');
    CKEDITOR.plugins.addExternal('audioembed', 'customPlugins/audioembed/');
    CKEDITOR.plugins.addExternal('imagelibrary', 'customPlugins/imagelibrary/');
    CKEDITOR.plugins.addExternal('videolibrary', 'customPlugins/videolibrary/');
	CKEDITOR.plugins.addExternal('eqneditor', 'customPlugins/eqneditor/');
	CKEDITOR.plugins.addExternal('fillintheblank', 'customPlugins/fillintheblank/');

	config.extraPlugins = 'justify,semantictags,fileuploader,image,floatingspace,mediaembed,audioembed,imagelibrary,videolibrary,eqneditor,fillintheblank';
    config.extraAllowedContent = 'iframe;td{*};th{*};';

    config.removeFormatTags = 'big,del,font,ins,kbd,s,small,strike,tt,var,figcaption,em,strong,u,abbr,acronym,blockquote,q,cite,dfn,code,samp,sub,sup,mark,time';

    config.startupOutlineBlocks = true;
    config.title = false;
    config.autoParagraph = false;

    config.magicline_color = '#aeb3b9';

    config.baseFloatZIndex = 200;
    config.dialog_noConfirmCancel = true;
    
    config.commandsToTrack = {
        'cut': 'Cut text',
        'copy': 'Copy text',
        'paste': 'Open "Paste" dialog',
        'pastetext': 'Open "Paste as plain text" dialog',
        'undo': 'Undo',
        'redo': 'Redo',
        'bold': 'Set text bold',
        'italic': 'Set text italic',
        'underline': 'Set text underline',
        'removeFormat': 'Remove format',
        'numberedlist': 'Create numbered list',
        'bulletedlist': 'Create bulleted list',
        'link': 'Open "Create link" dialog',
        'unlink': 'Remove link',
        'table': 'Open "Create table" dialog',
        'image': 'Open "Create image" dialog',
        'justifyleft': 'Set text align left',
        'justifycenter': 'Set text align center',
        'justifyright': 'Set text align right',
        'justifyblock': 'Set text align justify'
    };

    var editor = this;
    editor.addTrackingCommand = function (commandName, trackingEventTitle) {
        if (config.commandsToTrack[commandName]) {
            throw 'Tracking command "' + commandName + '" is already defined';
        }

        config.commandsToTrack[commandName] = trackingEventTitle;
        if (typeof editor.getCommand(commandName) === "undefined") {
            editor.addCommand(commandName, { exec: function () { } });
        }
    };
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