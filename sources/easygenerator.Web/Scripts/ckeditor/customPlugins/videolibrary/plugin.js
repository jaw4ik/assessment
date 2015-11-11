(function () {

    CKEDITOR.plugins.videolibrary = {
        requires: 'dialogui',
        lang: 'en,uk,zh-cn,pt-br,de,nl',

        commands: {
            selectVideo: 'selectVideo',
            openLibraryDialog: 'openVideoLibraryDialog',
            updateVideoList: 'updateVideoList'
        },
        videoLibraryDialogName: 'videoLibraryDialog',

        constants: {
            player: {
                host: "//" + window.playerUrl
            },
            storage: {
                host: "//" + window.storageServiceUrl,
                mediaUrl: '/media',
                video: {
                    vimeoToken: 'bearer a6b8a8d804e9044f9aa091b6687e70c1',
                    vimeoApiVideosUrl: 'https://api.vimeo.com/videos/',
                    thumbnailUrl: '/pictures',
                    defaultThumbnailUrl: '//i.vimeocdn.com/video/default_200x150.jpg',
                    iframeWidth: 600,
                    iframeHeight: 335,
                }
            }
        },

        onLoad: function () {
            var plugin = this;

            var videoLibrary = {
                $videosList: null,

                init: function (elementDomId) {
                    this.$videosList = $('#' + elementDomId);
                },

                clear: function () {
                    this.$videosList.empty();
                },

                addVideo: function (definition, onDblClick, onClick) {
                    if (!this.$videosList || !definition) {
                        return;
                    }

                    var $video = $('<img>');
                    $video.attr('src', definition.ThumbnailUrl);

                    var $videoHolder = $('<div>');
                    $videoHolder.addClass('video-library-item-img');
                    $videoHolder.append($video);
                    $videoHolder.append($('<div>'));

                    var $videoWrapper = $('<div>');
                    $videoWrapper.addClass('video-library-item-img-wrapper');
                    $videoWrapper.append($videoHolder);

                    var $text = $('<span>');
                    $text.html(definition.Title);
                    $text.addClass('video-library-item-text');

                    var $listItem = $('<div>');
                    $listItem.append($videoWrapper);
                    $listItem.append($text);
                    $listItem.addClass('video-library-item');
                    $listItem.hide();

                    if (!!onDblClick) {
                        $listItem.dblclick(onDblClick);
                    }

                    var that = this;
                    $listItem.click(function () {
                        that.selectVideo(this);

                        if (!!onClick) {
                            onClick();
                        }
                    });

                    $video.load(function () {
                        $listItem.show();
                    });

                    that.$videosList.append($listItem);
                },

                selectVideo: function (listItem) {
                    this.$videosList.find('.video-library-item').removeClass('selected');
                    if (!listItem.addClass) {
                        listItem = $(listItem);
                    }
                    listItem.addClass('selected');
                }
            };

            CKEDITOR.dialog.addUIElement('videoList', {

                build: function (dialog, elementDefinition, htmlList) {
                    var editor = dialog._.editor;

                    CKEDITOR.tools.extend(elementDefinition, {
                        commit: function () {
                            videoLibrary.init(this.domId);
                        },

                        setup: function () {
                            videoLibrary.clear();
                            editor.getCommand(plugin.commands.updateVideoList).exec();
                        }
                    });

                    editor.addCommand(plugin.commands.updateVideoList, new CKEDITOR.command(editor, {
                        exec: function () {
                            var loadingErrorDialogElement = dialog.getContentElement(plugin.mainTabId, plugin.loadingErrorIndicatorId).getElement();
                            var loaderDialogElement = dialog.getContentElement(plugin.mainTabId, plugin.loaderContainerId).getElement();
                            var emptyListDialogElement = dialog.getContentElement(plugin.mainTabId, plugin.emptyListIndicatorId).getElement();

                            loaderDialogElement.show();
                            emptyListDialogElement.hide();
                            loadingErrorDialogElement.hide();

                            var getThumbnailUrl = function (id) {
                                var deferred = Q.defer();

                                $.ajax({
                                    url: plugin.constants.storage.video.vimeoApiVideosUrl + id + plugin.constants.storage.video.thumbnailUrl,
                                    headers: { Authorization: plugin.constants.storage.video.vimeoToken },
                                    method: 'GET',
                                    global: false
                                }).then(function (response) {
                                    try {
                                        deferred.resolve(_.where(response.data[0].sizes, { width: 200, height: 150 })[0].link);
                                    } catch (exception) {
                                        deferred.resolve(plugin.constants.storage.video.defaultThumbnailUrl);
                                    }
                                }).fail(function () {
                                    deferred.resolve(plugin.constants.storage.video.defaultThumbnailUrl);
                                });

                                return deferred.promise;
                            }

                            var getThumbnailUrls = function (videos) {
                                var arrayPromises = [];
                                _.each(videos, function (video) {
                                    if (video.VimeoId) {
                                        arrayPromises.push(getThumbnailUrl(video.VimeoId).then(function (thumbnailUrl) {
                                            video.ThumbnailUrl = thumbnailUrl;
                                        }));
                                    }
                                });

                                return Q.allSettled(arrayPromises);
                            }

                            $.ajax(plugin.constants.storage.host + plugin.constants.storage.mediaUrl, { headers: window.auth.getHeader('storage'), global: false, cache: false })
                                .done(function (response) {
                                    if (!response || !response.Videos || response.Videos.length === 0) {
                                        emptyListDialogElement.show();
                                        loaderDialogElement.hide();
                                        return;
                                    }

                                    emptyListDialogElement.hide();

                                    var videos = response.Videos;

                                    return getThumbnailUrls(videos).then(function () {
                                        videos.forEach(function (video) {
                                            videoLibrary.addVideo(video,
                                                function () {
                                                    var command = editor.getCommand(plugin.commands.selectVideo);
                                                    command.data = video.VimeoId;
                                                    command.exec();

                                                    dialog.hide();
                                                },
                                                function () {
                                                    dialog.setValueOf(plugin.mainTabId, plugin.selectedVideoContainerId, video.VimeoId);
                                                }
                                            );
                                        });
                                        loaderDialogElement.hide();
                                        resizeDialog(videos.length);
                                    });
                                }).fail(function () {
                                    loaderDialogElement.hide();
                                    loadingErrorDialogElement.show();
                                });
                        }
                    }));

                    function resizeDialog(videosCount) {
                        var
                            rowHeight = 175,
                            screen = {
                                width: this.innerWidth,
                                height: this.innerHeight,
                                isHighResolution: this.innerWidth >= 1280
                            },
                            columnsCount = screen.isHighResolution ? 5 : 4,
                            enoughRowsCount = Math.ceil(videosCount / columnsCount),
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

                    return new CKEDITOR.ui.dialog.uiElement(dialog, elementDefinition, htmlList, "div", null, { 'class': 'video-library' });
                }
            });

            CKEDITOR.dialog.addUIElement('addVideoFromLibraryButton', {

                build: function (dialog, elementDefinition, htmlList) {
                    var
                        editor = dialog._.editor,
                        lang = editor.lang.videolibrary;

                    CKEDITOR.tools.extend(elementDefinition, {
                        label: lang.addFromLibrary,
                        className: 'cke_dialog_ui_button add-from-library-button',
                        onClick: function () {
                            editor.getCommand(plugin.commands.openLibraryDialog).exec();
                        }
                    });

                    editor.addCommand(plugin.commands.openLibraryDialog, new CKEDITOR.dialogCommand(plugin.videoLibraryDialogName, 'external'));

                    editor.addCommand(plugin.commands.selectVideo, new CKEDITOR.command(editor, {
                        exec: function () {
                            var vimeoId = this.data;
                            if (vimeoId) {
                                var embedCode = '<iframe src="' + plugin.constants.player.host + '?source=' + vimeoId + '&video=1&fullscreen_toggle=1&v=' + window.egVersion + '"' +
                                    ' width="' + plugin.constants.storage.video.iframeWidth +
                                    '" height="' + plugin.constants.storage.video.iframeHeight +
                                    '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen ></iframe>';
                                dialog.setValueOf(elementDefinition.parentContainerId, elementDefinition.embedCodeAreaId, embedCode);
                            }
                        }
                    }));

                    return new CKEDITOR.ui.dialog.button(dialog, elementDefinition, htmlList);
                }
            });

            CKEDITOR.dialog.add(plugin.videoLibraryDialogName, plugin.path + 'dialogs/videoLibrary.js');

            CKEDITOR.document.appendStyleSheet(plugin.path + 'styles.css');
        }
    };

    CKEDITOR.plugins.add('videolibrary', CKEDITOR.plugins.videolibrary);
})();