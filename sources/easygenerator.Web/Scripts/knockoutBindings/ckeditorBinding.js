ko.bindingHandlers.ckeditor = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var
            language = valueAccessor().language || 'en',
            eventTracker = valueAccessor().eventTracker || null,
            data = valueAccessor().data,
            isEditing = valueAccessor().isEditing,

            saveHandler = valueAccessor().save,
            focusHandler = valueAccessor().focus,
            blurHandler = valueAccessor().blur,

            autosaveInterval = valueAccessor().autosaveInterval || 60000,

            that = bindingContext.$root,
            saveIntervalId = null,
            $toolbarElement = null,
            editor = null,
            commandsToTrack = CKEDITOR.config.commandsToTrack || [],
            localizationManager = valueAccessor().localizationManager;

        CKEDITOR.config.language = language;

        //Floating Space plugin settings
        CKEDITOR.config.floatSpaceUpdateSettingsFunction = function () {
            var landmarkContainer = $('.page-view-caption').closest('.fixed-container');
            var offsetTop = parseInt(landmarkContainer.css('top')) + landmarkContainer.height();
            if (!!offsetTop)
                CKEDITOR.config.floatSpaceWindowOffsetTop = offsetTop;
        };
        CKEDITOR.config.baseFloatZIndex = 99;

        $(element).html(data());
        $(element).attr('contenteditable', true);
        editor = CKEDITOR.inline(element);

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
                setCaretToStart();
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
                    saveData();
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
            var widthRegExp = new RegExp("\s*width\s*:\s*([^;]*)", "g");
            var heightRegExp = new RegExp("\s*height\s*:\s*([^;]*)", "g");

            var rules = {
                elements: {
                    $: function (e) {
                        if (e.attributes.style) {
                            var width = e.attributes.style.match(widthRegExp) + ';';
                            var height = e.attributes.style.match(heightRegExp) + ';';
                            delete e.attributes.style;
                            e.attributes.style = width + height;
                        }

                        if (e.attributes.class) {
                            delete e.attributes.class;
                        }
                    }
                }
            };

            editor.dataProcessor.htmlFilter.addRules(rules);
            editor.dataProcessor.dataFilter.addRules(rules);
        }

        function filterContent(contentElement) {
            var $content = $(contentElement);

            $content.find('br').each(function (index, brElement) {
                $(brElement).replaceWith(' ');
            });

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

        function setCaretToStart() {
            var range = editor.createRange();
            range.moveToPosition(range.root, CKEDITOR.POSITION_BEFORE_END);
            editor.getSelection().selectRanges([range]);
        }

        function updateToolbarPosition() {
            var screenTop = document.documentElement.scrollTop || document.body.scrollTop;
            var editorTop = editor.container.getDocumentPosition().y - $toolbarElement.height();
            var toolbarTopPosition = screenTop > editorTop ? 0 : editorTop;
            $toolbarElement.css('top', toolbarTopPosition);
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};