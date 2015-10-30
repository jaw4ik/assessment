(function() {
    var plugin = CKEDITOR.plugins.audiolibrary;

    CKEDITOR.tools.extend(plugin, {
        mainTabId: 'audioLibrary',
        audioListContainerId: 'audioList',
        selectedAudioContainerId: 'selectedAudioUrl',
        emptyListIndicatorId: 'emptyAudioList',
        loadingErrorIndicatorId: 'listLoadingError',
        loaderContainerId: 'progressContainerId'
    });

    CKEDITOR.dialog.add(plugin.audioLibraryDialogName, function(editor) {
        var
            lang = editor.lang.audiolibrary,
            dialogDefinition = {
                title: lang.audioLibrary,
                minWidth: 805,
                minHeight: 350,

                onLoad: function () {
                    this.definition.dialog.commitContent();
                },

                onShow: function () {
                    this.definition.dialog.setupContent();
                    this.setValueOf(plugin.mainTabId, plugin.selectedAudioContainerId, plugin.selectedAudioUrl);
                },

                contents: [
                    {
                        id: plugin.mainTabId,
                        elements: [
                            {
                                type: 'vbox',
                                padding: 0,
                                className: 'audio-list-wrapper',
                                children: [
                                    {
                                        type: 'audioList',
                                        id: plugin.audioListContainerId
                                    },
                                    {
                                        type: 'hbox',
                                        id: plugin.emptyListIndicatorId,
                                        className: 'audio-library-empty-container',
                                        hidden: true,
                                        children: [
                                            {
                                                type: 'html',
                                                className: 'audio-library-empty',
                                                html: '<div><img src="' + plugin.path + 'icons/no-audio.png" /><span>' + lang.noAudio + '</span></div>'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'hbox',
                                        id: plugin.loaderContainerId,
                                        className: 'audio-library-loader',
                                        children: [
                                            {
                                                type: 'html',
                                                className: 'audio-library-empty',
                                                html: '<div class="audio-circular-loader"><div class="audio-circular-loader-item"></div><div class="audio-circular-loader-item"></div><div class="audio-circular-loader-item"></div><div class="audio-circular-loader-item"></div><div class="audio-circular-loader-item"></div><div class="audio-circular-loader-item"></div><div class="audio-circular-loader-item"></div><div class="audio-circular-loader-item"></div></div>'
                                            }
                                        ]
                                    },
                                    {
                                        type: 'vbox',
                                        id: plugin.loadingErrorIndicatorId,
                                        className: 'audio-library-error-container',
                                        hidden: true,
                                        children: [
                                            {
                                                type: 'html',
                                                className: 'audio-library-error',
                                                html: '<img src="' + plugin.path + 'icons/error.png" />'
                                            },
                                            {
                                                type: 'hbox',
                                                widths: ['0', '0'],
                                                children: [
                                                    {
                                                        type: 'html',
                                                        className: 'audio-library-error-text',
                                                        html: '<span>' + lang.somethingWentWrong + '</span>'
                                                    },
                                                    {
                                                        type: 'button',
                                                        className: 'try-again-button',
                                                        label: lang.tryAgain,
                                                        onClick: function () {
                                                            editor.getCommand(plugin.commands.updateAudioList).exec();
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'text',
                                        id: plugin.selectedAudioContainerId,
                                        hidden: true
                                    }
                                ]
                            }
                        ]
                    }
                ],

                buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],

                onOk: function () {
                    var selectedAudioUrl = this.getValueOf(plugin.mainTabId, plugin.selectedAudioContainerId);

                    var command = editor.getCommand(plugin.commands.selectAudio);
                    command.data = selectedAudioUrl;
                    command.exec();
                }
            };

        return dialogDefinition;
    });

})();