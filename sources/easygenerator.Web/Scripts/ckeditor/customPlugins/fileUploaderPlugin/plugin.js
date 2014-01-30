CKEDITOR.plugins.fileUploaderPlugin = {
    requires: 'dialogui',
    lang: 'en',

    init: function (editor) {
        CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
            fileUploadButton: function (dialog, elementDefinition, htmlList) {//dialog, elementDefinition, htmlList

                var
                    url = 'api/filestorage/upload',
                    maxFileSize = 10, //Mb
                    allowedFileExtensions = ['GIF', 'JPEG', 'JPG', 'PNG'],

                    fileInputId, frameId, statusContainerId,
                    lang = editor.lang.fileUploaderPlugin,
                    titleInstructions = lang.fileSizeNotMoreThan + ' ' + maxFileSize + 'MB\n' + lang.extensions + ': ' + allowedFileExtensions.join(', ');

                CKEDITOR.ui.dialog.uiElement.call(this, dialog, elementDefinition, htmlList, "div", {
                    position: 'relative'
                }, null, function () {
                    frameId = CKEDITOR.tools.getNextId() + "_frame";
                    fileInputId = CKEDITOR.tools.getNextId() + "_fileInput";
                    statusContainerId = CKEDITOR.tools.getNextId() + "_status";

                    var content = [
                        '<a class="cke_dialog_ui_button file_upload_button" href="javascript:void(0)">',
                            lang.chooseFile,
                            '<form action="', url, '" method="post" enctype="multipart/form-data" encoding="multipart/form-data" target="', frameId, '">',
                                '<input type="file" id="', fileInputId, '" name="', fileInputId, '" />',
                            '</form>',
                            '<iframe id="', frameId, '" name="', frameId, '"></iframe>',
                        '</a>',
                        '<span id="', statusContainerId, '"></span>'
                    ];
                    return content.join('');
                });

                dialog.on('load', function () {
                    var
                        statusContainer = CKEDITOR.document.getById(statusContainerId),
                        inputContainer = CKEDITOR.document.getById(fileInputId),
                        fileFrame = CKEDITOR.document.getById(frameId);

                    if (!statusContainer || !inputContainer || !fileFrame) {
                        throw "[FileUploaderPlugin] error: dialog data have not been loaded.";
                    }

                    var
                        statusManager = {
                            info: function () {
                                this.container.className = "";
                                this.container.title = titleInstructions;
                            },
                            failed: function () {
                                this.container.className = "failed";
                                this.container.title = lang.uploadFailed + ':\n' + titleInstructions;
                            },
                            loading: function () {
                                this.container.className = "loading";
                                this.container.title = "";
                            },
                            container: statusContainer.$
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
                                        statusManager.failed();
                                        return;
                                    }
                                    
                                    var file = this.files[0];
                                    if (file.size > maxFileSize * 1024 * 1024) {
                                        statusManager.failed();
                                        return;
                                    }
                                    
                                    var fileExtension = file.name.split('.').pop().toLowerCase();
                                    for (var i = 0; i < allowedFileExtensions.length; i++) {
                                        if (fileExtension == allowedFileExtensions[i].toLowerCase()) {
                                            inputManager.submit();
                                            return;
                                        }
                                    }
                                    statusManager.failed();
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
                                statusManager.failed();
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