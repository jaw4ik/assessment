(function () {

    CKEDITOR.plugins.audiolibrary = {
        requires: 'dialogui',
        lang: 'en,uk,zh-cn,pt-br,de,nl,es,it',
        audioLibraryDialogName: 'audioLibraryDialog',

        commands: {
            selectAudio: 'selectAudio',
            openAudioLibraryDialog: 'openAudioLibraryDialog',
            updateAudioList: 'updateAudioList'
        },

        constants: {
            player: {
                host: "//" + window.playerUrl
            },
            storage: {
                host: "//" + window.storageServiceUrl,
                mediaUrl: '/media',
                audio: {
                    vimeoUrl: 'https://vimeo.com',
                    vimeoOembedUrl: '/api/oembed.json',
                    defaultThumbnailUrl: 'icons/audio-thumbnail.jpg',
                    iframeWidth: 300,
                    iframeHeight: 46
                }
            }
        },

        onLoad: function() {
            var plugin = this;

            var audioLibrary = {
                $audioList: null,

                init: function (elementDomId) {
                    this.$audioList = $('#' + elementDomId);
                },

                clear: function () {
                    this.$audioList.empty();
                },

                addAudio: function (definition, onDblClick, onClick) {
                    if (!this.$audioList || !definition) {
                        return;
                    }

                    var $audio = $('<img>');
                    $audio.attr('src', definition.ThumbnailUrl);

                    var $audioHolder = $('<div>');
                    $audioHolder.addClass('audio-library-item-img');
                    $audioHolder.append($audio);
                    $audioHolder.append($('<div>'));

                    var $audioWrapper = $('<div>');
                    $audioWrapper.addClass('audio-library-item-img-wrapper');
                    $audioWrapper.append($audioHolder);

                    var $text = $('<span>');
                    $text.html(definition.Title);
                    $text.addClass('audio-library-item-text');

                    var $listItem = $('<div>');
                    $listItem.append($audioWrapper);
                    $listItem.append($text);
                    $listItem.addClass('audio-library-item');
                    $listItem.hide();

                    if (!!onDblClick) {
                        $listItem.dblclick(onDblClick);
                    }

                    var that = this;
                    $listItem.click(function () {
                        that.selectAudio(this);

                        if (!!onClick) {
                            onClick();
                        }
                    });

                    $audio.load(function () {
                        $listItem.show();
                    });

                    that.$audioList.append($listItem);
                },

                selectAudio: function (listItem) {
                    this.$audioList.find('.audio-library-item').removeClass('selected');
                    if (!listItem.addClass) {
                        listItem = $(listItem);
                    }
                    listItem.addClass('selected');
                }
            };

            CKEDITOR.dialog.addUIElement('audioList', {
                build: function (dialog, elementDefinition, htmlList) {
                    var editor = dialog._.editor;

                    CKEDITOR.tools.extend(elementDefinition, {
                        commit: function () {
                            audioLibrary.init(this.domId);
                        },

                        setup: function () {
                            audioLibrary.clear();
                            editor.getCommand(plugin.commands.updateAudioList).exec();
                        }
                    });

                    editor.addCommand(plugin.commands.updateAudioList, new CKEDITOR.command(editor, {
                        exec: function () {
                            var loadingErrorDialogElement = dialog.getContentElement(plugin.mainTabId, plugin.loadingErrorIndicatorId).getElement();
                            var loaderDialogElement = dialog.getContentElement(plugin.mainTabId, plugin.loaderContainerId).getElement();
                            var emptyListDialogElement = dialog.getContentElement(plugin.mainTabId, plugin.emptyListIndicatorId).getElement();

                            loaderDialogElement.show();
                            emptyListDialogElement.hide();
                            loadingErrorDialogElement.hide();

                            window.auth.getHeader('storage').then(function(value) {
                                $.ajax(plugin.constants.storage.host + plugin.constants.storage.mediaUrl, { headers: value, global: false, cache: false })
                                .done(function (response) {
                                    if (!response || !response.Audios || response.Audios.length === 0) {
                                        emptyListDialogElement.show();
                                        loaderDialogElement.hide();
                                        return;
                                    }

                                    emptyListDialogElement.hide();

                                    var audio = response.Audios;


                                    audio.forEach(function (item) {
                                        item.ThumbnailUrl = plugin.path + plugin.constants.storage.audio.defaultThumbnailUrl;

                                        audioLibrary.addAudio(item,
                                            function () {
                                                var command = editor.getCommand(plugin.commands.selectAudio);
                                                command.data = item.VimeoId;
                                                command.exec();

                                                dialog.hide();
                                            },
                                            function () {
                                                dialog.setValueOf(plugin.mainTabId, plugin.selectedAudioContainerId, item.VimeoId);
                                            }
                                        );
                                    });
                                    loaderDialogElement.hide();
                                    resizeDialog(audio.length);

                                }).fail(function () {
                                    loaderDialogElement.hide();
                                    loadingErrorDialogElement.show();
                                });
                            });
                        }
                    }));

                    function resizeDialog(itemsCount) {
                        var
                            rowHeight = 175,
                            screen = {
                                width: this.innerWidth,
                                height: this.innerHeight,
                                isHighResolution: this.innerWidth >= 1280
                            },
                            columnsCount = screen.isHighResolution ? 5 : 4,
                            enoughRowsCount = Math.ceil(itemsCount / columnsCount),
                            allowedRowsCount = Math.floor(screen.height / rowHeight) - 1,
                            rowsCount = enoughRowsCount > allowedRowsCount
                                ? allowedRowsCount
                                : enoughRowsCount >= 2 ? enoughRowsCount : 2,

                            widthToResize = screen.isHighResolution ? 1005 : 805,
                            heightToResize = rowsCount * rowHeight;

                        dialog.resize(widthToResize, heightToResize);
                        moveDialogToCenter();
                    }

                    function moveDialogToCenter() {
                        var
                            dialogSize = dialog.getSize(),
                            viewPaneSize = CKEDITOR.document.getWindow().getViewPaneSize(),

                            x = (viewPaneSize.width - dialogSize.width) / 2,
                            y = (viewPaneSize.height - dialogSize.height) / 2;

                        dialog.move(x, y);
                    }

                    return new CKEDITOR.ui.dialog.uiElement(dialog, elementDefinition, htmlList, "div", null, { 'class': 'cke-audio-library' });
                }
            });

            CKEDITOR.dialog.addUIElement('addAudioFromLibraryButton', {

                build: function (dialog, elementDefinition, htmlList) {
                    var
                        editor = dialog._.editor,
                        lang = editor.lang.audiolibrary;

                    CKEDITOR.tools.extend(elementDefinition, {
                        label: lang.addFromLibrary,
                        className: 'cke_dialog_ui_button add-from-library-button',
                        onClick: function () {
                            editor.getCommand(plugin.commands.openAudioLibraryDialog).exec();
                        }
                    });

                    editor.addCommand(plugin.commands.openAudioLibraryDialog, new CKEDITOR.dialogCommand(plugin.audioLibraryDialogName, 'external'));

                    editor.addCommand(plugin.commands.selectAudio, new CKEDITOR.command(editor, {
                        exec: function () {
                            var vimeoId = this.data;
                            if (vimeoId) {
                                var embedCode = '<iframe src="' + plugin.constants.player.host + '?source=' + vimeoId + '&v=' + window.egVersion + '"' +
                                    ' width="' + plugin.constants.storage.audio.iframeWidth +
                                    '" height="' + plugin.constants.storage.audio.iframeHeight +
                                    '" frameborder="0"></iframe>';
                                dialog.setValueOf(elementDefinition.parentContainerId, elementDefinition.embedCodeAreaId, embedCode);
                            }
                        }
                    }));

                    return new CKEDITOR.ui.dialog.button(dialog, elementDefinition, htmlList);
                }
            });

            CKEDITOR.dialog.add(plugin.audioLibraryDialogName, plugin.path + 'dialogs/audioLibrary.js');

            CKEDITOR.document.appendStyleSheet(plugin.path + 'styles.css');
        }
    };

    CKEDITOR.plugins.add('audiolibrary', CKEDITOR.plugins.audiolibrary);
})();