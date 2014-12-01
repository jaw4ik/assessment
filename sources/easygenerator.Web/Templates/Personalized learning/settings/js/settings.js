function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
}

$(function () {
    var
        courseId = getURLParameter('courseId'),
        templateId = getURLParameter('templateId'),

        baseURL = location.protocol + "//" + location.host,
        settingsURL = baseURL + "/api/course/" + courseId + "/template/" + templateId,

        starterAccessType = 1;

    var viewModel = {
        trackingData: (function() {
            var data = {};

            data.enableXAPI = ko.observable(false),

            data.lrsOptions = [
                { key: 'default', text: 'easygenerator (recommended)' },
                { key: 'custom', text: 'custom LRS' }
            ];
            data.selectedLrs = ko.observable(data.lrsOptions[0].key);

            data.customLrsEnabled = ko.computed(function() {
                return data.enableXAPI() && data.selectedLrs() != data.lrsOptions[0].key;
            });

            data.lrsUrl = ko.observable('');
            data.authenticationRequired = ko.observable(false);
            data.lapLogin = ko.observable();
            data.lapPassword = ko.observable();

            data.credentialsEnabled = ko.computed(function() {
                return data.customLrsEnabled() && data.authenticationRequired();
            });

            data.statements = {
                started: ko.observable(true),
                stopped: ko.observable(true),
                mastered: ko.observable(true),
                passed: ko.observable(true),
                failed: ko.observable(true)
            };

            return data;
        })(),

        isSaved: ko.observable(false),
        isFailed: ko.observable(false),

        logo: (function () {
            var logo = {};

            logo.url = ko.observable('').extend({ throttle: 300 });
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

        hasStarterPlan: ko.observable(true),
    };

    viewModel.saveChanges = function () {
        var settings = {
            logo: {
                url: viewModel.hasStarterPlan() ? viewModel.logo.url() : ''
            },
            xApi: {
                enabled: viewModel.trackingData.enableXAPI(),
                selectedLrs: viewModel.trackingData.selectedLrs(),
                lrs: {
                    uri: viewModel.trackingData.lrsUrl(),
                    authenticationRequired: viewModel.trackingData.authenticationRequired(),
                    credentials: {
                        username: viewModel.trackingData.lapLogin(),
                        password: viewModel.trackingData.lapPassword()
                    }
                },
                allowedVerbs: $.map(viewModel.trackingData.statements, function(value, key) {
                    return value() ? key : undefined;
                })
            }
        };

        viewModel.isFailed(false);
        viewModel.isSaved(false);

        $.post(settingsURL, { settings: JSON.stringify(settings) })
            .done(function () {
                viewModel.isSaved(true);
            })
            .fail(function () {
                viewModel.isFailed(true);
            });
    };

    $.ajax({
        cache: false,
        url: settingsURL,
        dataType: "json",
        success: function (json) {
            var defaultSettings = { logo: {}, xApi: { lrs: { credentials: {} } } };
            var settings;
            try {
                settings = JSON.parse(json.settings) || defaultSettings;
            } catch (e) {
                settings = defaultSettings;
            }
            viewModel.trackingData.enableXAPI(settings.xApi.enabled || false);
            var defaultLrs = settings.xApi.enabled ? 'custom' : 'default';
            viewModel.trackingData.selectedLrs(settings.xApi.selectedLrs || defaultLrs);
            viewModel.trackingData.lrsUrl(settings.xApi.lrs.uri || '');
            viewModel.trackingData.authenticationRequired(settings.xApi.lrs.authenticationRequired || false);
            viewModel.trackingData.lapLogin(settings.xApi.lrs.credentials.username || '');
            viewModel.trackingData.lapPassword(settings.xApi.lrs.credentials.password || '');

            if (settings.xApi.allowedVerbs) {
                $.each(viewModel.trackingData.statements, function(key, value) {
                    value($.inArray(key, settings.xApi.allowedVerbs) > -1);
                });
            }

            viewModel.logo.url(settings.logo.url || '');
        },

    });

    $.ajax({
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

    ko.bindingHandlers.number = {
        init: function (element) {
            var $element = $(element),
                maxValue = 100;
            $element.on('keydown', function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40) ||
                        (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $element.on('keyup', function () {
                if ($(this).val() > maxValue) {
                    $(this).val(maxValue);
                }
            });
        }
    };

    ko.bindingHandlers.disableDragNDrop = {
        init: function (element) {
            $(element).on('dragstart', function (event) {
                event.preventDefault();
            });
        }
    };

    ko.bindingHandlers.switchToggle = {
        init: function(element, valueAccessor) {
            var switchToggle = ko.bindingHandlers.switchToggle,
                viewModel = switchToggle.viewModel(element, valueAccessor),
                value = ko.unwrap(valueAccessor().value());

            viewModel.setInitialValue(value);

            switchToggle.onClick(element, function() {
                viewModel.toggle();

                var currentValue = ko.unwrap(valueAccessor().value());
                valueAccessor().value(!currentValue);
            });
        },
        update: function(element, valueAccessor) {
            var viewModel = ko.bindingHandlers.switchToggle.viewModel(element, valueAccessor),
                value = ko.unwrap(valueAccessor().value());

            viewModel.updateValue(value);
        },
        viewModel: function(element) {
            var $element = $(element),
                $wrapper = $('.switch-toggle-wrapper', $element);

            function setInitialValue(value) {
                setElementValue(value);
                updateElementPosition(value);
            }

            function toggle() {
                var value = getValue();
                setElementValue(!value);

                $wrapper.stop().animate({
                    marginLeft: calculateElementLeftMargin(!value)
                }, 250);
            }

            function getValue() {
                return $element.hasClass('on');
            }

            function updateValue(value) {
                if (getValue() != value) {
                    setInitialValue(value);
                }
            }

            function setElementValue(value) {
                $element.toggleClass('on', value);
                $element.toggleClass('off', !value);
            }

            function updateElementPosition(value) {
                $wrapper.css('margin-left', calculateElementLeftMargin(value) + 'px');
            }

            function calculateElementLeftMargin(value) {
                return value ? 0 : $element.height() - $element.width();
            }

            return {
                setInitialValue: setInitialValue,
                updateValue: updateValue,
                toggle: toggle
            }
        },
        onClick: function(element, handler) {
            var $element = $(element),
                isMouseDownFired = false;

            $element.mousedown(function(event) {
                if (event.which != 1)
                    return;

                isMouseDownFired = true;
                handler();
            });

            $element.click(function() {
                if (isMouseDownFired) {
                    isMouseDownFired = false;
                    return;
                }

                handler();
            });
        }
    };

    ko.bindingHandlers.dropdown = {
        cssClasses: {
            dropdown: 'dropdown',
            disabled: 'disabled',
            expanded: 'expanded',
            optionsList: 'dropdown-options-list',
            optionItem: 'dropdown-options-item',
            currentItem: 'dropdown-current-item',
            currentItemText: 'dropdown-current-item-text',
            indicatorHolder: 'dropdown-indicator-holder',
            indicator: 'dropdown-indicator'
        },
        init: function(element, valueAccessor) {
            var $element = $(element),
                cssClasses = ko.bindingHandlers.dropdown.cssClasses;

            $element.addClass(cssClasses.dropdown);

            var $currentItemElement = $('<div />')
                .addClass(cssClasses.currentItem)
                .appendTo($element);

            $('<div />')
                .addClass(cssClasses.currentItemText)
                .appendTo($currentItemElement);

            var $indicatorHolder = $('<div />')
                .addClass(cssClasses.indicatorHolder)
                .appendTo($currentItemElement);

            $('<span />')
                .addClass(cssClasses.indicator)
                .appendTo($indicatorHolder);

            $('<ul />')
                .addClass(cssClasses.optionsList)
                .appendTo($element);

            $currentItemElement.on('click', function(e) {
                if ($element.hasClass(cssClasses.disabled)) {
                    return;
                }

                $currentItemElement.toggleClass(cssClasses.expanded);
                e.stopPropagation();
            });

            var collapseHandler = function() {
                $currentItemElement.removeClass(cssClasses.expanded);
            };

            $('html').bind('click', collapseHandler);
            $(window).bind('blur', collapseHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                $('html').unbind('click', collapseHandler);
                $(window).unbind('blur', collapseHandler);
            });
        },
        update: function(element, valueAccessor) {
            var $element = $(element),
                cssClasses = ko.bindingHandlers.dropdown.cssClasses,

                $optionsListElement = $element.find('ul.' + cssClasses.optionsList),
                $currentItemTextElement = $element.find('div.' + cssClasses.currentItemText);


            var options = valueAccessor().options,
                optionsText = valueAccessor().optionsText,
                value = valueAccessor().value,
                optionsValue = valueAccessor().optionsValue,
                currentValue = ko.unwrap(value),
                disable = ko.unwrap(valueAccessor().disable);

            if (disable) {
                $element.toggleClass(cssClasses.disabled);
            } else {
                $element.removeClass(cssClasses.disabled);
            }

            $optionsListElement.empty();

            $.each(options, function(index, option) {
                if (option[optionsValue] == currentValue) {
                    $currentItemTextElement.text(option[optionsText]);
                    return;
                }

                $('<li />')
                    .addClass(cssClasses.optionItem)
                    .appendTo($optionsListElement)
                    .text(option[optionsText])
                    .on('click', function(e) {
                        value(option[optionsValue]);
                        $element.trigger('change');
                    });
            });
        }
    };

    ko.applyBindings(viewModel, $("#settingsForm")[0]);

    //----------------Upload logo functionality------------------
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

});