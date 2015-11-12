(function () {

    //Plugin initialization
    CKEDITOR.plugins.imagelibrary = {
        requires: 'dialogui',
        lang: 'en,uk,zh-cn,pt-br,de,nl',

        commands: {
            selectImage: 'selectImage',
            getSelectedImage: 'getSelectedImage',
            openLibraryDialog: 'openImageLibraryDialog',
            updateImageList: 'updateImageList'
        },
        imageLibraryDialogName: 'imageLibraryDialog',
        getUserImagesApiUrl: 'api/images',

        selectedImageUrl: null,

        onLoad: function () {
            var plugin = this;

            //jQuery image library
            var imageLibrary = {
                $imagesList: null,

                //Library initialization. 
                //elementDomId: dom ID of element, which will contain images list
                init: function (elementDomId) {
                    this.$imagesList = $('#' + elementDomId);
                },

                //Remove all images.
                clear: function () {
                    this.$imagesList.empty();
                },

                //Add image to list.
                //definition: image definition (src: image source, title: image file name)
                //onDblClick: function, which will be fired on double click on image
                //onClick: function, which will be fired on click on image
                addImage: function (definition, onDblClick, onClick) {
                    if (!this.$imagesList || !definition) {
                        return;
                    }

                    var $image = $('<img>');
                    $image.attr('src', definition.src + '?width=173&height=128');

                    var $imageHolder = $('<div>');
                    $imageHolder.addClass('image-library-item-img');
                    $imageHolder.append($image);
                    $imageHolder.append($('<div>'));

                    var $imageWrapper = $('<div>');
                    $imageWrapper.addClass('image-library-item-img-wrapper');
                    $imageWrapper.append($imageHolder);

                    var $text = $('<span>');
                    $text.html(definition.title);
                    $text.addClass('image-library-item-text');

                    var $listItem = $('<div>');
                    $listItem.append($imageWrapper);
                    $listItem.append($text);
                    $listItem.addClass('image-library-item');
                    $listItem.hide();

                    if (definition.src == plugin.selectedImageUrl) {
                        this.selectImage($listItem);
                    }

                    if (!!onDblClick) {
                        $listItem.dblclick(onDblClick);
                    }

                    var that = this;
                    $listItem.click(function () {
                        that.selectImage(this);

                        if (!!onClick) {
                            onClick();
                        }
                    });

                    $image.load(function () {
                        $listItem.show();
                    });

                    that.$imagesList.append($listItem);
                },

                //Makes image selected in images list
                //listItem: image item from images list
                selectImage: function (listItem) {
                    this.$imagesList.find('.image-library-item').removeClass('selected');
                    if (!listItem.addClass) {
                        listItem = $(listItem);
                    }
                    listItem.addClass('selected');
                }
            };

            //Adding image list definition which will be used on image library dialog
            CKEDITOR.dialog.addUIElement('imageList', {

                build: function (dialog, elementDefinition, htmlList) {
                    var editor = dialog._.editor;

                    CKEDITOR.tools.extend(elementDefinition, {
                        //This function called once on dialog initialization
                        commit: function () {
                            imageLibrary.init(this.domId);
                        },

                        //This function called when dialog opens
                        setup: function () {
                            imageLibrary.clear();
                            editor.getCommand(plugin.commands.getSelectedImage).exec();
                            editor.getCommand(plugin.commands.updateImageList).exec();
                        }
                    });

                    //Adding command to update image list
                    editor.addCommand(plugin.commands.updateImageList, new CKEDITOR.command(editor, {
                        exec: function () {
                            var loadingErrorDialogElement = dialog.getContentElement(plugin.mainTabId, plugin.loadingErrorIndicatorId).getElement();
                            loadingErrorDialogElement.hide();

                            var requestArgs = {
                                url: plugin.getUserImagesApiUrl,
                                type: 'POST',
                                headers: window.auth.getHeader('api')
                            };

                            $.ajax(requestArgs)
                                .done(function (response) {
                                    var emptyListDialogElement = dialog.getContentElement(plugin.mainTabId, plugin.emptyListIndicatorId).getElement();

                                    if (!response || !response.data || response.data.length === 0) {
                                        emptyListDialogElement.show();
                                        return;
                                    }

                                    emptyListDialogElement.hide();
                                    loadingErrorDialogElement.hide();

                                    response.data.forEach(function (image) {
                                        imageLibrary.addImage(image,
                                            //Double click event
                                            function () {
                                                var command = editor.getCommand(plugin.commands.selectImage);
                                                command.data = image.src;
                                                command.exec();

                                                dialog.hide();
                                            },
                                            //Click event
                                            function () {
                                                dialog.setValueOf(plugin.mainTabId, plugin.selectedImageContainerId, image.src);
                                            }
                                        );
                                    });

                                    resizeDialog(response.data.length);
                                })
                                .fail(function () {
                                    loadingErrorDialogElement.show();
                                });
                        }
                    }));

                    function resizeDialog(imagesCount) {
                        var
                            rowHeight = 175,
                            screen = {
                                width: this.innerWidth,
                                height: this.innerHeight,
                                isHighResolution: this.innerWidth >= 1280
                            },
                            columnsCount = screen.isHighResolution ? 5 : 4,
                            enoughRowsCount = Math.ceil(imagesCount / columnsCount),
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

                    return new CKEDITOR.ui.dialog.uiElement(dialog, elementDefinition, htmlList, "div", null, { 'class': 'image-library' });
                }
            });

            //Button's definition
            CKEDITOR.dialog.addUIElement('addImageFromLibraryButton', {

                //Build method calling to build button on dialog
                build: function (dialog, elementDefinition, htmlList) {
                    var
                        editor = dialog._.editor,
                        lang = editor.lang.imagelibrary;

                    CKEDITOR.tools.extend(elementDefinition, {
                        label: lang.addFromLibrary,
                        className: 'cke_dialog_ui_button add-from-library-button',
                        onClick: function () {
                            editor.getCommand(plugin.commands.openLibraryDialog).exec();
                        }
                    });

                    //Adding command to open dialog
                    editor.addCommand(plugin.commands.openLibraryDialog, new CKEDITOR.dialogCommand(plugin.imageLibraryDialogName, 'external'));

                    //Adding command to set selected image url to dialog 'URL' field
                    editor.addCommand(plugin.commands.selectImage, new CKEDITOR.command(editor, {
                        exec: function () {
                            dialog.setValueOf(elementDefinition.urlContainer[0], elementDefinition.urlContainer[1], this.data);
                        }
                    }));

                    //Adding command to get selected image url from dialog 'URL' field
                    editor.addCommand(plugin.commands.getSelectedImage, new CKEDITOR.command(editor, {
                        exec: function () {
                            plugin.selectedImageUrl = dialog.getValueOf(elementDefinition.urlContainer[0], elementDefinition.urlContainer[1]);
                        }
                    }));

                    return new CKEDITOR.ui.dialog.button(dialog, elementDefinition, htmlList);
                }
            });

            //Adding dialog to CKEDITOR
            CKEDITOR.dialog.add(plugin.imageLibraryDialogName, plugin.path + 'dialogs/imageLibrary.js');

            //Append style sheets file
            CKEDITOR.document.appendStyleSheet(plugin.path + 'styles.css');
        }
    };

    CKEDITOR.plugins.add('imagelibrary', CKEDITOR.plugins.imagelibrary);
})();