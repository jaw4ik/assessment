(function () {

    var plugin = CKEDITOR.plugins.imagelibrary;
    CKEDITOR.tools.extend(plugin, {
        mainTabId: 'imageLibrary',
        imageListContainerId: 'imagesList',
        selectedImageContainerId: 'selectedImageUrl',
        emptyListIndicatorId: 'emptyImageList',
        loadingErrorIndicatorId: 'listLoadingError'
    });

    CKEDITOR.dialog.add(plugin.imageLibraryDialogName, function (editor) {

        var
            lang = editor.lang.imagelibrary,
            
            dialogDefinition = {
                title: lang.imageLibrary,
                minWidth: 805,
                minHeight: 350,
                onLoad: function () {
                    this.definition.dialog.commitContent();
                },
                onShow: function () {
                    this.definition.dialog.setupContent();
                    this.setValueOf(plugin.mainTabId, plugin.selectedImageContainerId, plugin.selectedImageUrl);
                },
                contents: [
                    {
                        id: plugin.mainTabId,
                        elements: [
                            {
                                type: 'vbox',
                                padding: 0,
                                className: 'images-list-wrapper',
                                children: [
                                    {
                                        type: 'imageList',
                                        id: plugin.imageListContainerId
                                    },
                                    {
                                        type: 'vbox',
                                        id: plugin.emptyListIndicatorId,
                                        className: 'image-library-empty',
                                        hidden: true,
                                        children: [
                                            {
                                                type: 'html',
                                                className: 'image-library-empty-image',
                                                html: '<img src="' + plugin.path + 'icons/no-images.png" />'
                                            },
                                            {
                                                type: 'html',
                                                className: 'image-library-empty-text',
                                                html: '<span>' + lang.noImages + '</span>'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'vbox',
                                        id: plugin.loadingErrorIndicatorId,
                                        className: 'image-library-error',
                                        hidden: true,
                                        children: [
                                            {
                                                type: 'html',
                                                className: 'image-library-error-image',
                                                html: '<img src="' + plugin.path + 'icons/error.png" />'
                                            },
                                            {
                                                type: 'hbox',
                                                widths: ['0', '0'],
                                                children: [
                                                    {
                                                        type: 'html',
                                                        className: 'image-library-error-text',
                                                        html: '<span>' + lang.somethingWentWrong + '</span>'
                                                    },
                                                    {
                                                        type: 'button',
                                                        className: 'try-again-button',
                                                        label: lang.tryAgain,
                                                        onClick: function () {
                                                            editor.getCommand(plugin.commands.updateImageList).exec();
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'text',
                                        id: plugin.selectedImageContainerId,
                                        hidden: true
                                    }
                                ]
                            }
                        ]
                    }
                ],
                buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
                onOk: function () {
                    var selectedImageUrl = this.getValueOf(plugin.mainTabId, plugin.selectedImageContainerId);

                    var command = editor.getCommand(plugin.commands.selectImage);
                    command.data = selectedImageUrl;
                    command.exec();
                }
            };

        return dialogDefinition;
    });

})();