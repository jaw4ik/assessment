(function () {

    var plugin = CKEDITOR.plugins.documentembed;

    CKEDITOR.dialog.add(plugin.dialogName, function (editor) {
        var lang = editor.lang.documentembed;

        return {
            title: lang.ebmedDocument,
            minWidth: 440,
            minHeight: 285,
            contents: [
            {
                id: 'Google',
                label: lang.googleDocuments,
                title: lang.googleDocuments,
                elements: [{
                    type: 'hbox',
                    padding: 0,
                    className: 'embed-document-title-wrapper',
                    widths: ['auto', '100%'],
                    children: [{
                        type: 'html',
                        className: 'embed-document-image',
                        html: '<img src="' + plugin.path + 'icons/googledocuments.png" />'
                    }, {
                        type: 'html',
                        className: 'embed-document-title',
                        html: '<span>' + lang.googleDocumentsTitle + '</span>'
                    }]
                }, {
                    type: 'html',
                    className: 'embed-document-text',
                    html: lang.howItWork
                }, {
                    type: 'html',
                    className: 'embed-document-list',
                    html: lang.googleDocumentsExplanation
                }, {
                    type: 'html',
                    className: 'embed-document-text',
                    html: lang.thatIt
                }, {
                    id: 'embedAreaGoogle',
                    type: 'textarea',
                    className: 'embed-code-textarea',
                    rows: 12,
                    onLoad: function () {
                        this.getInputElement().$.setAttribute('placeholder', lang.pasteEmbedCode);
                    },
                    onChange: function () {
                        editor.execCommand(plugin.commands.editCode);
                    },
                    autofocus: 'autofocus'
                }]
            }, {
                id: 'Slideshare',
                label: lang.slideshare,
                title: lang.slideshare,
                elements: [{
                    type: 'hbox',
                    padding: 0,
                    className: 'embed-document-title-wrapper',
                    widths: ['auto', '100%'],
                    children: [{
                        type: 'html',
                        className: 'embed-document-image',
                        html: '<img src="' + plugin.path + 'icons/slideshare.png" />'
                    }, {
                        type: 'html',
                        className: 'embed-document-title',
                        html: '<span>' + lang.slideshareTitle + '</span>'
                    }]
                }, {
                    type: 'html',
                    className: 'embed-document-text',
                    html: lang.howItWork
                }, {
                    type: 'html',
                    className: 'embed-document-list',
                    html: lang.slideshareExplanation
                }, {
                    type: 'html',
                    className: 'embed-document-text',
                    html: lang.thatIt
                }, {
                    id: 'embedAreaSlideshare',
                    type: 'textarea',
                    className: 'embed-code-textarea',
                    rows: 12,
                    onLoad: function () {
                        this.getInputElement().$.setAttribute('placeholder', lang.pasteEmbedCode);
                    },
                    onChange: function () {
                        editor.execCommand(plugin.commands.editCode);
                    },
                    autofocus: 'autofocus'
                }]
            }, {
                id: 'Other',
                label: lang.other,
                title: lang.other,
                elements: [{
                    type: 'hbox',
                    padding: 0,
                    className: 'embed-document-title-wrapper',
                    widths: ['auto', '100%'],
                    children: [{
                        type: 'html',
                        className: 'embed-document-image',
                        html: '<img src="' + plugin.path + 'icons/otherdocuments.png" />'
                    }, {
                        type: 'html',
                        className: 'embed-document-title',
                        html: '<span>' + lang.otherTitle + '</span>'
                    }]
                }, {
                    type: 'html',
                    className: 'embed-document-text',
                    html: lang.howItWork
                }, {
                    type: 'html',
                    className: 'embed-document-list',
                    html: lang.otherDocumentsExplanation
                }, {
                    type: 'html',
                    className: 'embed-document-text',
                    html: lang.thatIt
                }, {
                    id: 'embedAreaOther',
                    type: 'textarea',
                    className: 'embed-code-textarea',
                    rows: 12,
                    onLoad: function() {
                        this.getInputElement().$.setAttribute('placeholder', lang.pasteEmbedCode);
                    },
                    onChange: function () {
                        editor.execCommand(plugin.commands.editCode);
                    },
                    autofocus: 'autofocus'
                }]
            }],
            onOk: function () {
                var div = editor.document.createElement('div');
                var currentTabId = this._.currentTabId;
                var $currentTabInputValue = $(this.getContentElement(currentTabId, 'embedArea' + currentTabId).getValue());
                var width = $currentTabInputValue.attr('width');
                var height = $currentTabInputValue.attr('height');
                if (typeof width === 'undefined') {
                    $currentTabInputValue.attr('width', '100%');
                }
                if (typeof height === 'undefined') {
                    $currentTabInputValue.attr('height', '600px');
                }
                div.setHtml($('<div>').append($currentTabInputValue).html());
                editor.insertElement(div);
                editor.execCommand(plugin.commands.pasteCode);
            }
        };
    });
})();