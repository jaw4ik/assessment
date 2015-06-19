(function () {

    var plugin = CKEDITOR.plugins.videolibrary;
    CKEDITOR.tools.extend(plugin, {
        mainTabId: 'videoLibrary',
        videoListContainerId: 'videosList',
        selectedVideoContainerId: 'selectedVideoUrl',
        emptyListIndicatorId: 'emptyVideoList',
        loadingErrorIndicatorId: 'listLoadingError'
    });

    CKEDITOR.dialog.add(plugin.videoLibraryDialogName, function (editor) {

        var
            lang = editor.lang.videolibrary,
            
            dialogDefinition = {
                title: lang.videoLibrary,
                minWidth: 805,
                minHeight: 350,
                onLoad: function () {
                    this.definition.dialog.commitContent();
                },
                onShow: function () {
                    this.definition.dialog.setupContent();
                    this.setValueOf(plugin.mainTabId, plugin.selectedVideoContainerId, plugin.selectedVideoUrl);
                },
                contents: [
                    {
                        id: plugin.mainTabId,
                        elements: [
                            {
                                type: 'vbox',
                                padding: 0,
                                className: 'videos-list-wrapper',
                                children: [
                                    {
                                        type: 'videoList',
                                        id: plugin.videoListContainerId
                                    },
                                    {
                                        type: 'hbox',
                                        id: plugin.emptyListIndicatorId,
                                        className: 'video-library-empty',
                                        hidden: true,
                                        children: [
                                            {
                                                type: 'html',
                                                className: 'video-library-empty-video',
                                                html: '<div><img src="' + plugin.path + 'icons/no-videos.png" /><span>' + lang.noVideos + '</span></div>'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'vbox',
                                        id: plugin.loadingErrorIndicatorId,
                                        className: 'video-library-error',
                                        hidden: true,
                                        children: [
                                            {
                                                type: 'html',
                                                className: 'video-library-error-video',
                                                html: '<img src="' + plugin.path + 'icons/error.png" />'
                                            },
                                            {
                                                type: 'hbox',
                                                widths: ['0', '0'],
                                                children: [
                                                    {
                                                        type: 'html',
                                                        className: 'video-library-error-text',
                                                        html: '<span>' + lang.somethingWentWrong + '</span>'
                                                    },
                                                    {
                                                        type: 'button',
                                                        className: 'try-again-button',
                                                        label: lang.tryAgain,
                                                        onClick: function () {
                                                            editor.getCommand(plugin.commands.updateVideoList).exec();
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'text',
                                        id: plugin.selectedVideoContainerId,
                                        hidden: true
                                    }
                                ]
                            }
                        ]
                    }
                ],
                buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
                onOk: function () {
                    var selectedVideoUrl = this.getValueOf(plugin.mainTabId, plugin.selectedVideoContainerId);

                    var command = editor.getCommand(plugin.commands.selectVideo);
                    command.data = selectedVideoUrl;
                    command.exec();
                }
            };

        return dialogDefinition;
    });

})();