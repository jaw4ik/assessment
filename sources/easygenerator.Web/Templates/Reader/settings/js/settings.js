function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
}

function sendPostMessage(message) {
    var editorWindow = window.parent;
    editorWindow.postMessage(message, window.location.href);
}

$(function () {

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value));
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    var
        courseId = getURLParameter('courseId'),
        templateId = getURLParameter('templateId'),

        baseURL = location.protocol + "//" + location.host,
        settingsURL = baseURL + "/api/course/" + courseId + "/template/" + templateId,

        currentSettings = null,

        starterAccessType = 1;

    var viewModel = {
        logo: (function () {
            var logo = {};

            logo.url = ko.observable('');
            logo.hasLogo = ko.computed(function () {
                return logo.url() != '';
            });
            logo.clear = function () {
                logo.url('');
            };
            logo.isError = ko.observable(false);
            logo.errorText = ko.observable('');
            logo.errorDescription = ko.observable('');
            logo.isLoading = ko.observable(false);

            return logo;
        })(),

        hasStarterPlan: ko.observable(true)
    };

    viewModel.saveChanges = function () {
        var settings = initSettings();

        if (JSON.stringify(currentSettings) === JSON.stringify(settings)) {
            return;
        }

        sendPostMessage({ type: 'startSave' });

        $.post(settingsURL, { settings: JSON.stringify(settings) })
            .done(function () {
                currentSettings = settings;
                sendPostMessage({ type: 'finishSave', data: { success: true, message: 'All changes are saved' } });
            })
            .fail(function () {
                sendPostMessage({ type: 'finishSave', data: { success: false, message: 'Changes have NOT been saved. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.' } });
            });
    };

    function initSettings() {
        return {
            logo: {
                url: viewModel.hasStarterPlan() ? viewModel.logo.url() : ''
            }
        };
    }

    $(window).on('blur', viewModel.saveChanges);

    //#region Ajax   

    var userInfoDeffered = $.ajax({
        url: baseURL + '/api/identify',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (user) {
            if (user.hasOwnProperty('subscription') && user.subscription.hasOwnProperty('accessType')) {
                var hasStarterAccess = user.subscription.accessType >= starterAccessType && new Date(user.subscription.expirationDate) >= new Date();
                viewModel.hasStarterPlan(hasStarterAccess);
            } else {
                viewModel.hasStarterPlan(false);
            }
        },
        error: function () {
            viewModel.hasStarterPlan(false);
        }
    });

    $.ajax({
        cache: false,
        url: settingsURL,
        dataType: "json",
        success: function (json) {
            var defaultSettings = { logo: {} };
            var settings;
            try {
                settings = JSON.parse(json.settings) || defaultSettings;
            } catch (e) {
                settings = defaultSettings;
            }

            viewModel.logo.url(settings.logo.url || '');
        },
        complete: function () {
            userInfoDeffered.complete(function () {
                currentSettings = initSettings();
            });
        }
    });

    //#endregion Ajax

    ko.applyBindings(viewModel, $("#settingsForm")[0]);

    //#region Upload logo functionality

    var
        uploadImageApiUrl = baseURL + '/storage/image/upload',
        maxFileSize = 10, //MB
        supportedExtensions = ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
        somethingWentWrongMessage = { title: 'Something went wrong', description: 'Please, try again' },

        imageUploadStatus = {
            default: function () {
                viewModel.logo.isLoading(false);
                viewModel.logo.isError(false);
            },
            fail: function (reason) {
                viewModel.logo.clear();
                viewModel.logo.isLoading(false);
                viewModel.logo.errorText(reason.title);
                viewModel.logo.errorDescription(reason.description);
                viewModel.logo.isError(true);
            },
            loading: function () {
                viewModel.logo.isLoading(true);
            }
        },

        imageUploadButton = {
            enable: function () {
                this.$input.attr('disabled', false).closest('.image-upload-button').removeClass('disabled');
            },
            disable: function () {
                this.$input.attr('disabled', true).closest('.image-upload-button').addClass('disabled');
            },
            submit: function () {
                this.$input[0].form.submit();
                this.disable();
                imageUploadStatus.loading();
            },
            $input: (function () {
                return $('#logoInput').on('change', processFile);
            })()
        };

    if (window.top.navigator.userAgent.match(/MSIE 9/i)) {
        initFrame();
    }

    function processFile() {
        if (!this.files) {
            imageUploadButton.submit();
            return;
        }
        if (this.files.length == 0) {
            return;
        }

        var file = this.files[0],
            fileExtension = file.name.split('.').pop().toLowerCase();

        if ($.inArray(fileExtension, supportedExtensions) === -1) {
            imageUploadStatus.fail({ title: 'Unsupported image format', description: '(Supported formats: ' + supportedExtensions.join(', ') + ')' });
            return;
        }
        if (file.size > maxFileSize * 1024 * 1024) {
            imageUploadStatus.fail({ title: 'File is too large', description: '(Max file size: ' + maxFileSize + 'MB)' });
            return;
        }
        uploadFile(file);
    }

    function uploadFile(file) {
        imageUploadButton.disable();
        imageUploadStatus.loading();

        var formData = new FormData();
        formData.append("file", file);

        $.ajax({
            url: uploadImageApiUrl,
            type: 'POST',
            data: formData,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        }).done(function (response) {
            handleResponse(response);
        }).fail(function () {
            imageUploadStatus.fail(somethingWentWrongMessage);
            imageUploadButton.enable();
        });
    }

    function initFrame() {
        $('#logoForm').attr('action', uploadImageApiUrl);
        $('#logoFrame').on('readystatechange', function () {
            if (this.readyState != "complete") {
                return;
            }

            try {
                var response = this.contentDocument.body.innerHTML;
                handleResponse(response);
            } catch (e) {
                imageUploadStatus.fail(somethingWentWrongMessage);
                imageUploadButton.enable();
            }
        });
    }

    function handleResponse(response) {
        try {
            if (!response) {
                throw "Response is empty";
            }

            if (typeof response != "object") {
                response = JSON.parse(response);
            }

            if (!response || !response.success || !response.data) {
                throw "Request is not success";
            }

            viewModel.logo.url(response.data.url);
            imageUploadStatus.default();
        } catch (e) {
            imageUploadStatus.fail(somethingWentWrongMessage);
        } finally {
            imageUploadButton.enable();
        }
    }

    //#endregion Upload logo functionality

});