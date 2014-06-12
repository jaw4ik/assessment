ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var language = valueAccessor().language || 'en',
            eventTracker = valueAccessor().eventTracker || null,
            data = valueAccessor().data,
            isEditing = valueAccessor().isEditing,
            saveHandler = valueAccessor().save,
            focusHandler = valueAccessor().focus,
            blurHandler = valueAccessor().blur,
            autosaveInterval = valueAccessor().autosaveInterval || 60000,
            fillInTheBlank = valueAccessor().fillInTheBlank || false,
            that = bindingContext.$root,
            saveIntervalId = null,
            $toolbarElement = null,
            editor = null,

            localizationManager = valueAccessor().localizationManager,

            inPageSettings = {};

        CKEDITOR.config.language = language;

        //Floating Space plugin settings
        CKEDITOR.config.editorsHolderId = 'view_content';
        CKEDITOR.config.floatSpaceUpdateSettingsFunction = function () {
            var landmarkContainer = $('#' + CKEDITOR.config.editorsHolderId);
            var offsetTop = parseInt(landmarkContainer.offset().top);
            if (!!offsetTop)
                CKEDITOR.config.floatSpaceWindowOffsetTop = offsetTop;
        };

        if (fillInTheBlank) {
            inPageSettings.extraAllowedContent = 'span[*]; input[*]';
        } else {
            inPageSettings.removePlugins = 'fillInTheBlank';
        }
        
        $(element).html(data());

        $(element).attr('contenteditable', true);
        editor = CKEDITOR.inline(element, inPageSettings);

        editor.on('instanceReady', function () {
            $toolbarElement = $('#cke_' + editor.name);

            //fix for firefox table resize tools
            if (/Firefox/i.test(navigator.userAgent)) {
                editor.document.$.execCommand("enableObjectResizing", false, "false");
                editor.document.$.execCommand("enableInlineTableEditing", false, "false");
            }

            addContentFilter();
            addCommandsTracking();

            editor.on('focus', function () {
                if (!isEditing())
                    isEditing(true);

                if (!!focusHandler)
                    focusHandler.call(that, viewModel);

                updateToolbarPosition();
                saveIntervalId = setInterval(saveData, autosaveInterval);
            });

            if (isEditing()) {
                editor.focus();
            }

            editor.on('blur', onBlur);

            editor.on('key', function (event) {
                if (event.data.keyCode == 27) {
                    $(editor.editable().$).blur();
                }
            });

            editor.on('change', function () {
                data(editor.getData());
            });

            // FIX for IE.
            editor.on('afterCommandExec', function (evt) {
                if (evt.data.name === 'undo' || evt.data.name === 'redo') {
                    editor.focus();
                }
            });

            editor.on('paste', function () {
                setTimeout(function () {
                    filterContent(editor.editable().$);
                }, 100);
            });

            $(editor.editable().$).on('drop', function () {
                setTimeout(function () {
                    filterContent(editor.editable().$);
                }, 100);
            });

            $(window).one("hashchange", function () {
                if (isEditing()) {
                    editor.removeListener('blur', onBlur);
                    onBlur();
                }
            });
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (!!CKEDITOR.dialog._.currentTop)
                CKEDITOR.dialog._.currentTop.hide();

            clearInterval(saveIntervalId);

            editor.destroy(true);
            $(element).removeAttr('contenteditable');
        });

        function onBlur() {
            isEditing(false);

            if (!!blurHandler)
                blurHandler.call(that, viewModel);

            clearInterval(saveIntervalId);
        };

        function saveData() {
            if (!!saveHandler) {
                filterContent(editor.editable().$);
                data(editor.getData());
                saveHandler.call(that, viewModel);
            }
        }

        function addCommandsTracking() {
            if (!editor || !eventTracker)
                return;

            var commandsToTrack = editor.config.commandsToTrack || [];
            _.each(editor.commands, function (command) {
                if (commandsToTrack.indexOf(command.name) != -1) {
                    (function (cmd) {
                        var baseExec = cmd.exec;
                        cmd.exec = function (eventInfo) {
                            eventTracker.publish(cmd.name, 'CKEditor');
                            baseExec.call(cmd, eventInfo);
                        };
                    })(command);
                }
            });

            editor.on('publishSemanticEvent', function (eventInfo) {
                eventTracker.publish('Semantic tag \"' + localizationManager.localize(eventInfo.data, localizationManager.defaultCulture) + '\" applied', 'CKEditor');
            });
        }

        function addContentFilter() {
            var widthRegExp = new RegExp('(^| )width\s*:\s*([^;]*)', 'g'),
                heightRegExp = new RegExp('(^| )height\s*:\s*([^;]*)', 'g'),
                floatRegExp = new RegExp('(^| )float\s*:\s*([^;]*)', 'g'),
                borderStyleRegExp = new RegExp('(^| )border-style\s*:\s*([^;]*)', 'g'),
                borderWidthRegExp = new RegExp('(^| )border-width\s*:\s*([^;]*)', 'g'),
                marginRegExp = new RegExp('(^| )margin\s*:\s*([^;]*)', 'g'),
                marginTopRegExp = new RegExp('(^| )margin-top\s*:\s*([^;]*)', 'g'),
                marginLeftRegExp = new RegExp('(^| )margin-left\s*:\s*([^;]*)', 'g'),
                marginRightRegExp = new RegExp('(^| )margin-right\s*:\s*([^;]*)', 'g'),
                marginBottomRegExp = new RegExp('(^| )margin-bottom\s*:\s*([^;]*)', 'g');

            var rules = {
                elements: {
                    $: function (e) {
                        if (e.attributes.style) {
                            var
                                widthValue = e.attributes.style.match(widthRegExp) + ';',
                                heightValue = e.attributes.style.match(heightRegExp) + ';',
                                floatValue = e.attributes.style.match(floatRegExp) + ';',
                                borderWidthValue = e.attributes.style.match(borderWidthRegExp) + ';',
                                borderStyleValue = e.attributes.style.match(borderStyleRegExp) + ';',
                                marginValue = e.attributes.style.match(marginRegExp) + ';',
                                marginTopValue = e.attributes.style.match(marginTopRegExp) + ';',
                                marginLeftValue = e.attributes.style.match(marginLeftRegExp) + ';',
                                marginRightValue = e.attributes.style.match(marginRightRegExp) + ';',
                                marginBottomValue = e.attributes.style.match(marginBottomRegExp) + ';';

                            delete e.attributes.style;
                            e.attributes.style = widthValue + heightValue
                                + floatValue
                                + borderWidthValue + borderStyleValue
                                + marginValue + marginTopValue + marginLeftValue + marginRightValue + marginBottomValue;
                        }
                        if (e.attributes.class) {
                            if (!e.attributes['data-group-id']) {
                                delete e.attributes.class;
                            }
                        }
                    }
                }
            };

            editor.dataProcessor.htmlFilter.addRules(rules);
            editor.dataProcessor.dataFilter.addRules(rules);
        }

        function filterContent(contentElement) {
            var $content = $(contentElement);

            $content.find('style').each(function (index, styleElement) {
                $(styleElement).remove();
            });

            var isContentEmpty = _.every($content.contents(), function (child) {
                return isElementEmpty(child);
            });

            if (isContentEmpty) {
                $content.empty();
            }
        }

        function isElementEmpty(e) {
            var $element = $(e);

            if (e.nodeType == 3 && $element.text().trim().length == 0) {
                return true;
            }

            if ($element.prop("tagName") != 'P') {
                return false;
            }

            if ($element.contents().length == 0) {
                return true;
            }

            return _.every($element.contents(), function (child) {
                return isElementEmpty(child);
            });
        }

        function updateToolbarPosition() {
            var screenTop = document.documentElement.scrollTop || document.body.scrollTop;
            var editorTop = editor.container.getDocumentPosition().y - $toolbarElement.height();
            var toolbarTopPosition = screenTop > editorTop ? 0 : editorTop;
            $toolbarElement.css('top', toolbarTopPosition);
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var data = valueAccessor().data(),
            fillInTheBlank = valueAccessor().fillInTheBlank || false,
            isEditing = valueAccessor().isEditing();


        if (!isEditing) {
            var editor = _.find(CKEDITOR.instances, function (item) {
                return item.element.$ == element;
            });
            if (!fillInTheBlank && !_.isNullOrUndefined(editor) && editor.getData() != data) {
                editor.setData(data);
            }
        }
    }
};