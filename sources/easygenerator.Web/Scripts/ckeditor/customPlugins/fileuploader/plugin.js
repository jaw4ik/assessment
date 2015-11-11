(function () {

    CKEDITOR.plugins.fileuploader = {
        requires: 'dialogui',
        lang: 'en,uk,zh-cn,pt-br,de,nl',

        onLoad: function () {

            //Button's definition
            CKEDITOR.dialog.addUIElement("fileUploadButton", {

                //Build method calling to build button on dialog
                build: function (dialog, elementDefinition, htmlList) {
                    var url = 'storage/image/upload',
                        maxFileSize = 10, //MB
                        allowedFileExtensions = ['jpeg', 'jpg', 'png', 'gif'],

                        fileInputId, frameId, preloaderContainerId, statusContainerId,
                        lang = dialog._.editor.lang.fileuploader;

                    dialog.on('load', function () {
                        var
                            preloaderContainer = CKEDITOR.document.getById(preloaderContainerId),
                            statusContainer = CKEDITOR.document.getById(statusContainerId),
                            inputContainer = CKEDITOR.document.getById(fileInputId),
                            fileFrame = CKEDITOR.document.getById(frameId);

                        if (!preloaderContainer || !statusContainer || !inputContainer || !fileFrame) {
                            throw "[FileUploaderPlugin] error: dialog data have not been loaded.";
                        }

                        var
                            status = {
                                info: function () {
                                    this.$preloaderContainer.hide();
                                    this.$container.hide();
                                },
                                failed: function (reason) {
                                    this.$preloaderContainer.hide();
                                    this.$container.text(reason);
                                    this.$container.show();
                                },
                                loading: function () {
                                    this.$preloaderContainer.show();
                                },
                                $container: $(statusContainer.$),
                                $preloaderContainer: $(preloaderContainer.$)
                            },

                            input = {
                                enable: function () {
                                    this.container.offsetParent.className = this.container.offsetParent.className.replace(" disabled", "");
                                    this.container.disabled = false;
                                },
                                disable: function () {
                                    this.container.offsetParent.className += " disabled";
                                    this.container.disabled = true;
                                },
                                submit: function () {
                                    this.container.form.submit();
                                    this.disable();
                                    status.loading();
                                },
                                container: (function () {
                                    var c = inputContainer.$;
                                    c.onchange = function () {
                                        if (!this.files) {
                                            input.submit();
                                            return;
                                        }

                                        if (this.files.length == 0) {
                                            return;
                                        }

                                        var file = this.files[0],
                                            fileExtension = file.name.split('.').pop().toLowerCase();

                                        if ($.inArray(fileExtension, allowedFileExtensions) === -1) {
                                            status.failed(lang.extensionNotSupported + fileExtension);
                                            return;
                                        }

                                        if (file.size > maxFileSize * 1024 * 1024) {
                                            status.failed(lang.fileCannotBeLargerThan + maxFileSize + ' MB');
                                            return;
                                        }

                                        uploader.uploadFile(file);
                                    };
                                    return c;
                                })()
                            },

                            frame = {
                                init: function () {
                                    fileFrame.on('readystatechange', function () {
                                        if (this.readyState != "complete") {
                                            return;
                                        }

                                        try {
                                            var response = this.contentDocument.body.innerHTML;
                                            handleResponse(response);
                                        } catch (e) {
                                            status.failed(lang.somethingWentWrong);
                                            input.enable();
                                        }
                                    }, fileFrame.$);
                                }
                            },

                            uploader = {
                                uploadFile: function (file) {
                                    input.disable();
                                    status.loading();

                                    var formData = new FormData();
                                    formData.append("file", file);

                                    $.ajax({
                                        url: url,
                                        type: 'POST',
                                        headers: window.auth.getHeader('api'),
                                        data: formData,
                                        cache: false,
                                        dataType: 'json',
                                        processData: false, // Don't process the files
                                        contentType: false // Set content type to false as jQuery will tell the server its a query string request,
                                    }).done(function (response) {
                                        handleResponse(response);
                                    }).fail(function () {
                                        status.failed(lang.somethingWentWrong);
                                        input.enable();
                                    });
                                }
                            };

                        status.info();
                        frame.init();

                        function handleResponse(response) {
                            try {
                                if (!response) {
                                    throw "Request is empty";
                                }

                                if (typeof response != "object") {
                                    response = JSON.parse(response);
                                }

                                if (!response || !response.success || !response.data) {
                                    throw "Request is not success";
                                }

                                if (elementDefinition.urlContainer && elementDefinition.urlContainer.length == 2) {
                                    dialog.setValueOf(elementDefinition.urlContainer[0], elementDefinition.urlContainer[1], response.data.url);
                                    status.info();
                                }
                            } catch (e) {
                                status.failed(lang.somethingWentWrong);
                            } finally {
                                input.enable();
                            }
                        }
                    });

                    return new CKEDITOR.ui.dialog.uiElement(dialog, elementDefinition, htmlList, "div", {
                        position: 'relative'
                    }, null, function () {
                        frameId = CKEDITOR.tools.getNextId() + "_frame";
                        fileInputId = CKEDITOR.tools.getNextId() + "_fileInput";
                        preloaderContainerId = CKEDITOR.tools.getNextId() + "_preloader";
                        statusContainerId = CKEDITOR.tools.getNextId() + "_status";

                        var content = [
                            '<a class="cke_dialog_ui_button file_upload_button" href="javascript:void(0)">',
                                lang.uploadFile,
                                '<form action="', url, '" method="post" enctype="multipart/form-data" encoding="multipart/form-data" target="', frameId, '">',
                                    '<input type="file" id="', fileInputId, '" name="file" />',
                                '</form>',
                                '<iframe id="', frameId, '" name="', frameId, '"></iframe>',
                            '</a>',
                            '<span class="file_upload_preloader" id="', preloaderContainerId, '"></span>',
                            '<div class="file_upload_status" id="', statusContainerId, '">File not allowed</div>'
                        ];
                        return content.join('');
                    });
                }
            });

            //Append style sheets file
            CKEDITOR.document.appendStyleSheet(this.path + 'styles.css');
        }
    };

    CKEDITOR.plugins.add('fileuploader', CKEDITOR.plugins.fileuploader);
})();