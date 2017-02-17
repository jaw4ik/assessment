(function () {

    CKEDITOR.plugins.fileuploader = {
        requires: 'dialogui',
        lang: 'en,uk,zh-cn,pt-br,de,nl,es,it',

        onLoad: function () {

            //Button's definition
            CKEDITOR.dialog.addUIElement('fileUploadButton', {

                //Build method calling to build button on dialog
                build: function (dialog, elementDefinition, htmlList) {
                    var fileInputId, preloaderContainerId, statusContainerId,
                        lang = dialog._.editor.lang.fileuploader,
                        maxFileSize = 10,
                        allowedFileExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

                    dialog.on('load', function (){
                        var fileUploadButton = CKEDITOR.document.getById(fileInputId);
                        var preloaderContainer = CKEDITOR.document.getById(preloaderContainerId);
                        var statusContainer = CKEDITOR.document.getById(statusContainerId);
                        var uploadUrl = window.imageSeviceUrl ? '//' + window.imageSeviceUrl + '/image/upload' : '//localhost:222/image/upload';
                        var $container = $(statusContainer.$);
                        var $preloaderContainer = $(preloaderContainer.$);
                        
                        $preloaderContainer.hide();
                        $container.hide();

                        var callback = function (file){
                            $preloaderContainer.show();
                            $container.hide();
                            var fileExtension = file.name.split('.').pop().toLowerCase();
                            
                            if ($.inArray(fileExtension, allowedFileExtensions) === -1) {
                                $container.text(lang.extensionNotSupported + fileExtension);
                                $container.show();
                                return;
                            }

                            if (file.size > maxFileSize * 1024 * 1024) {
                                $container.text(lang.somethingWentWrong);
                                $container.show(lang.fileCannotBeLargerThan + maxFileSize + ' MB');
                                return;
                            }
                            window.auth.getHeader('api').then(function(header) {
                                upload(uploadUrl, file, header).then(function (response) {
                                    $preloaderContainer.hide();
                                    if (!response) {
                                        throw 'Request is empty';
                                    }

                                    if (typeof response !== 'object') {
                                        response = JSON.parse(response);
                                    }

                                    if (elementDefinition.urlContainer && elementDefinition.urlContainer.length === 2) {
                                        dialog.setValueOf(elementDefinition.urlContainer[0], elementDefinition.urlContainer[1], response.url);
                                    }
                                }).catch(function (e) {
                                    $preloaderContainer.hide();
                                    $container.text(lang.somethingWentWrong);
                                    $container.show();
                                });
                            });
                        };

                        if (!preloaderContainer || !statusContainer || !fileUploadButton) {
                            throw '[FileUploaderPlugin] error: dialog data have not been loaded.';
                        }

                        browse(fileUploadButton.$, callback);
                    });

                    return new CKEDITOR.ui.dialog.uiElement(dialog, elementDefinition, htmlList, 'div', {
                        position: 'relative'
                    }, null, function () {
                        fileInputId = CKEDITOR.tools.getNextId() + '_fileInput';
                        preloaderContainerId = CKEDITOR.tools.getNextId() + '_preloader';
                        statusContainerId = CKEDITOR.tools.getNextId() + '_status';

                        var content = [
                            '<a class="cke_dialog_ui_button file_upload_button" id="', fileInputId, '" href="javascript:void(0)">',
                                lang.uploadFile,
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

    function upload(url, file, headers) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            var error = function(err) { reject(err); };
            var success = function(obj) { resolve(obj); }

            xhr.addEventListener('error', error);

            xhr.onreadystatechange = function (e) {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        try {
                            success(JSON.parse(this.response));
                        } catch (err) {
                            error(err);
                        }
                    } else {
                        error(e);
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.responseType = 'text';

            if (headers) {
                for (var header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, headers[header]);
                    }
                }
            }

            var formData = new FormData();
            formData.append('file', file);

            xhr.send(formData);
        });
    }

    function browse(element, callback) {
        var browse = new BrowseFile();
        browse.on('selected', callback)
            .accept('.png, .jpg, .jpeg, .gif, .bmp')
            .multiple(false);

        $(element).on('click', function () {
            browse.open();
        });
    }
})();