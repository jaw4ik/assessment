CKEDITOR.plugins.fileUploaderPlugin = {
    requires: 'dialogui',
    lang: 'en',

    init: function (editor) {
        CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
            fileUploadButton: function (dialog, elementDefinition, htmlList) {//dialog, elementDefinition, htmlList

                var
                    url = 'storage/image/upload',
                    maxFileSize = 10, //MB
                    allowedFileExtensions = ['jpeg', 'jpg', 'png', 'gif'],

                    fileInputId, frameId, preloaderContainerId, statusContainerId,
                    lang = editor.lang.fileUploaderPlugin,
                    titleInstructions = lang.fileSizeNotMoreThan + ' ' + maxFileSize + 'MB\n' + lang.extensions + ': ' + allowedFileExtensions.join(', ');

                CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, "div", {
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
                        statusManager = {
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

                        inputManager = {
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
                                statusManager.loading();
                            },
                            container: (function () {
                                var c = inputContainer.$;
                                c.onchange = function () {
                                    if (!this.files) {
                                        inputManager.submit();
                                        return;
                                    }

                                    if (this.files.length == 0) {
                                        return;
                                    }

                                    var
                                        file = this.files[0],
                                        fileExtension = file.name.split('.').pop().toLowerCase();

                                    if ($.inArray(fileExtension, allowedFileExtensions) === -1) {
                                        statusManager.failed(lang.extensionNotSupported + fileExtension);
                                        return;
                                    }

                                    if (file.size > maxFileSize * 1024 * 1024) {
                                        statusManager.failed(lang.fileCannotBeLargerThan + maxFileSize + ' MB');
                                        return;
                                    }

                                    inputManager.submit();
                                };
                                return c;
                            })()
                        },

                        handleResult = function () {
                            try {
                                var requestResult = this.contentDocument.body.innerHTML;
                                if (!requestResult) {
                                    statusManager.info();
                                    return;
                                }

                                var result = JSON.parse(requestResult);
                                if (!result || !result.success || !result.data) {
                                    throw "Request is not success";
                                }

                                if (elementDefinition.urlContainer && elementDefinition.urlContainer.length == 2) {
                                    dialog.setValueOf(elementDefinition.urlContainer[0], elementDefinition.urlContainer[1], result.data.url);
                                    statusManager.info();
                                }
                            } catch (e) {
                                statusManager.failed(lang.somethingWentWrong);
                            } finally {
                                inputManager.enable();
                            }
                        };

                    statusManager.info();

                    if (window.top.navigator.userAgent.indexOf("MSIE") > -1) {
                        fileFrame.$.onreadystatechange = function () {
                            if (this.readyState == "complete") {
                                handleResult.call(this);
                            }
                        };
                    } else {
                        fileFrame.$.onload = handleResult;
                    }

                });
            }
        });

        CKEDITOR.ui.dialog.fileUploadButton.prototype = new CKEDITOR.ui.dialog.button;

        var builder = {
            build: function (dialog, elementDefinition, htmlList) {
                return new CKEDITOR.ui.dialog[elementDefinition.type](dialog, elementDefinition, htmlList);
            }
        };

        CKEDITOR.dialog.addUIElement("fileUploadButton", builder);

        CKEDITOR.document.appendStyleSheet(CKEDITOR.basePath + 'customPlugins/fileUploaderPlugin/styles.css');
    }
};
CKEDITOR.plugins.add('fileUploaderPlugin', CKEDITOR.plugins.fileUploaderPlugin);