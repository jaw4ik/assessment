﻿ko.bindingHandlers.ckeditor = {
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

        var events = {
            addBlank: 'Add blank (fill in the blanks)',
            addDropDownBlank: 'Add drop down (fill in the blanks)'
        };

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
            inPageSettings.extraAllowedContent = 'span[*]; input[*]; select[*]; option[*]';
            inPageSettings.floatSpaceDockedOffsetY = 45;
        } else {
            inPageSettings.removePlugins = 'fillInTheBlank';
        }

        $(element).addClass('styled-content');
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
            addSpellCheckerForContextMenu();

            editor.editable().on('keyup', function (e) {
                var event = e || window.event;
                if (!event.data.$.charCode) {
                    checkTableButtonVisibility();
                }
            });

            editor.editable().on('click', function (e) {
                checkTableButtonVisibility();
            });

            editor.on('focus', function (e) {
                if (!isEditing())
                    isEditing(true);

                if (!!focusHandler)
                    focusHandler.call(that, viewModel);

                updateToolbarPosition();
                saveIntervalId = setInterval(saveData, autosaveInterval);
                $('html').bind('mouseup', setData);
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

            $(element).on('input', function () {
                editor.fire('change');
            });

            editor.on('change', function (evt) {
                data(editor.getData());
                evt.cancel();
                return;
            });

            editor.on('afterSetData', function (evt) {
                evt.cancel();
            });

            // FIX for IE.
            editor.on('afterCommandExec', function (evt) {
                if (evt.data.name === 'undo' || evt.data.name === 'redo') {
                    editor.focus();
                }
                checkTableButtonVisibility();
            });

            editor.on('paste', function (e) {
                var event = e || window.event,
                    pasteData = event.data.dataValue;

                if (isElementInFocus("table") && pasteData.indexOf('<table') != -1) {
                    event.cancel();
                } else {

                    var $pasteData = $('<paste>').append($.parseHTML(pasteData)),
                        $refs = $('a', $pasteData);

                    $.each($refs, function (index, item) {
                        var $item = $(item);
                        if ($item.attr('target') != '_self') {
                            $item.attr('target', '_blank');
                        };
                    });

                    event.data.dataValue = $pasteData.html();
                }

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

        function setData() {
            setTimeout(function () {
                data(editor.getData());
            }, 10);
        }

        function isElementInFocus(tagName) {
            var focusedElement = editor.getSelection().getStartElement();

            while (focusedElement) {
                if (focusedElement && focusedElement.getName() == tagName) {
                    return true;
                }
                focusedElement = focusedElement.getParent();
            }
            return false;
        }

        function checkTableButtonVisibility() {
            var tableButton = editor.ui.instances.Table._;

            if (isElementInFocus("table")) {
                tableButton.state = CKEDITOR.TRISTATE_DISABLED;
                $('#' + tableButton.id).addClass('cke_button_disabled');
            }
            else {
                tableButton.state = CKEDITOR.TRISTATE_OFF;
                $('#' + tableButton.id).removeClass('cke_button_disabled');
            }
        }

        function addSpellCheckerForContextMenu() {
            var groupName = 'disabled',
                iconPath = '/content/images/spell-checker.png',
                localizationKey = CKEDITOR.env.mac ? 'spellCheckerMac' : 'spellCheckerWindows',
                label = localizationManager.localize(localizationKey);


            editor.addCommand('customSpellChecker', { exec: function () { } });
            editor.addMenuGroup(groupName);
            editor.contextMenu.addListener(function () { return { customSpellChecker: CKEDITOR.TRISTATE_DISABLED }; });

            editor.addMenuItems({
                customSpellChecker: {
                    label: label,
                    command: 'customSpellChecker',
                    group: groupName,
                    icon: iconPath,
                    order: 1
                }
            });
        }

        function onBlur() {
            var doc = editor.document,
                selected = document.activeElement;

            clearInterval(saveIntervalId);

            isEditing(false);
            if (!!blurHandler) {
                blurHandler.call(that, viewModel);
                $('html').unbind('mouseup', setData);
            }

            if (!doc || selected.contentEditable || $(selected).is('input, textarea')) {
                return;
            }

            var newRange = new CKEDITOR.dom.range(doc),
                body = doc.getBody();
            newRange.setStart(body, 0);
            newRange.setEnd(body, 0);
            newRange.select();
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

            if (fillInTheBlank) {
                editor.on(CKEDITOR.plugins.fillInTheBlank.events.addBlank, function () {
                    eventTracker.publish(events.addBlank);
                });
                editor.on(CKEDITOR.plugins.fillInTheBlank.events.addDropDownBlank, function () {
                    eventTracker.publish(events.addDropDownBlank);
                });
            }
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
    update: function (element, valueAccessor) {
        var data = valueAccessor().data(),
            isEditing = valueAccessor().isEditing(),
            forcedFocus = valueAccessor().forcedFocus || false;

        var editor = _.find(CKEDITOR.instances, function (item) {
            return item.element.$ == element;
        });

        if (!isEditing) {
            if (!_.isNullOrUndefined(editor) && editor.getData() != data) {
                editor.setData(data);
            }
        }
        else if (forcedFocus && !editor.focusManager.hasFocus) {
            editor.focus();
        }
    }
};