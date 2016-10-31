define(function (require) {
    'use strict';

    require('localization/bindingHandlers/localizeBindingHandler');
    require('components/bindingHandlers/tooltipBindingHandler').install();
    require('components/bindingHandlers/backgroundBindingHandler');
    require('components/bindingHandlers/fileBrowserBindingHandler');
    require('components/bindingHandlers/fileDropUploadBindingHandler');
    require('components/bindingHandlers/expandableBlockBindingHandler');
    require('components/bindingHandlers/ifExtendedBindingHandler');
    require('components/bindingHandlers/customScrollbarBindingHandler');
    require('components/bindingHandlers/windowMessageListenerBindingHandler');
    require('components/bindingHandlers/tipBindingHandler');
    require('components/bindingHandlers/tabsBindingHandler');
    require('components/bindingHandlers/heightAnimation');
    require('components/bindingHandlers/expandBlock');
    require('components/bindingHandlers/stopPropagationBindingHandler');
    require('viewmodels/questions/dragAndDropText/bindingHandlers/draggableTextBindingHandler');
    require('viewmodels/questions/hotSpot/bindingHandlers/polygonsEditorBindingHandler').install();
    require('viewmodels/questions/fillInTheBlank/bindingHandlers/fillInTheBlankBindingHandler');
    require('viewmodels/questions/singleSelectImage/bindingHandlers/answerImageBindingHandler');
    require('widgets/imagePreview/bindingHandlers/fadeBindingHandler');
    require('widgets/imagePreview/bindingHandlers/imageLoaderBindingHandler');
    require('viewmodels/courses/bindingHandlers/elementCollapseBinding');
    require('viewmodels/courses/bindingHandlers/courseIntroductionAnimationBinding');
    require('contentEditor/contentTypes/hotspot/bindingHandlers/hotspotOnImageBindingHandler');
    require('widgets/dialog/bindingHandlers/dialogBindingHandler');
    require('widgets/dialog/bindingHandlers/dialogWizardBindingHandler');
    require('editor/course/bindingHandlers/hightlightSection');
    require('editor/course/bindingHandlers/tooltipPopover');
    require('components/bindingHandlers/dates/dateBindingHandler');
    require('components/bindingHandlers/dates/dateFromNowBindingHandler');
    require('components/bindingHandlers/editableTextBindingHandler');
    require('components/bindingHandlers/cursorTooltipBindingHandler');
    require('components/bindingHandlers/ratingBindingHandler');
    require('components/bindingHandlers/coverBackgroundBindingHandler');
    require('widgets/dialog/bindingHandlers/dialogWizardBindingHandler');
    require('design/bindingHandlers/spectrumBindingHandler');
    require('design/bindingHandlers/slideToggleBindingHandler');
    require('design/bindingHandlers/brightnessBindingHandler');
    require('design/bindingHandlers/popoverBindingHandler');
    require('design/bindingHandlers/textStyleBindingHandler');
    require('widgets/modalView/bindingHandlers/lockScrollBindingHandler');
    require('widgets/modalView/bindingHandlers/visibleAnimateBindingHandler');
    require('widgets/tags/bindingHandlers/dynamicWidthInput');
    require('widgets/tags/bindingHandlers/setFocusByClick');
    require('dragAndDrop/bindingHandlers/draggableContainer');
    require('dragAndDrop/bindingHandlers/draggableData');
    require('components/htmlEditor/bindingHandlers/htmlEditorBindingHandler');
    require('components/bindingHandlers/copyToClipboardBindingHandler');
    require('components/bindingHandlers/lazyForeachBindingHandler');

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        ko.bindingHandlers.sortable.options = {
            opacity: 0.7,
            placeholder: 'sortable-list-placeholder',
            forcePlaceholderSize: true,
            containment: 'body',
            tolerance: 'pointer',
            cursor: 'move',
            start: function (e, ui) {
                if (/MSIE/i.test(navigator.userAgent)) {
                    ui.placeholder.height(ui.item.height());
                }
            },
            sort: function (event, ui) {

                var $target = $(event.target);
                var customScrollContainerClass = '.question-view-holder-wrapper';
                if (!/html|body/i.test($target.offsetParent()[0].tagName)) {
                    var top = event.pageY - $target.offsetParent().offset().top - (ui.helper.outerHeight(true) / 2);
                    if ($target.closest(customScrollContainerClass)) {
                        top += $(customScrollContainerClass).scrollTop();
                    }

                    ui.helper.css({
                        'top': top + 'px'
                    });
                }
            },
            stop: function (event, ui) {
                ui.item.css('z-index', '');
            }
        };

        ko.validation.init({
            insertMessages: false
        });

        ko.bindingHandlers['css2'] = ko.bindingHandlers.css;
    }

});