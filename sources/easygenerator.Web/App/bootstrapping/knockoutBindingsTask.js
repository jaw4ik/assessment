define(function (require) {
    "use strict";

    require('localization/bindingHandlers/localizeBindingHandler');
    require('components/bindingHandlers/tooltipBindingHandler').install();
    require('components/bindingHandlers/backgroundBindingHandler');
    require('components/bindingHandlers/fileBrowserBindingHandler');
    require('components/bindingHandlers/fileDropUploadBindingHandler');
    require('components/bindingHandlers/expandableBlockBindingHandler');
    require('components/bindingHandlers/customScrollbarBindingHandler');
    require('viewmodels/questions/dragAndDropText/bindingHandlers/draggableTextBindingHandler');
    require('viewmodels/questions/hotSpot/bindingHandlers/polygonsEditorBindingHandler').install();
    require('viewmodels/questions/fillInTheBlank/bindingHandlers/fillInTheBlankBindingHandler');
    require('viewmodels/questions/singleSelectImage/bindingHandlers/answerImageBindingHandler');
    require('widgets/imagePreview/bindingHandlers/fadeBindingHandler');
    require('widgets/imagePreview/bindingHandlers/imageLoaderBindingHandler');
    require('viewmodels/courses/bindingHandlers/elementCollapseBinding');
    require('viewmodels/courses/bindingHandlers/windowMessageListenerBinding');
    require('viewmodels/courses/bindingHandlers/courseIntroductionAnimationBinding');
    require('viewmodels/courses/bindingHandlers/publishTabBinding');
    require('viewmodels/learningContents/bindingHandlers/hotspotOnImageBindingHandler');
    require('widgets/dialog/bindingHandlers/dialogBindingHandler');
    require('widgets/dialog/bindingHandlers/dialogWizardBindingHandler');
    require('editor/course/bindingHandlers/expandBlock');
    require('editor/course/bindingHandlers/draggableContainer');
    require('editor/course/bindingHandlers/draggableData');
    require('components/bindingHandlers/dateBindingHadler');
    require('components/bindingHandlers/editableTextBindingHandler');
    require('components/bindingHandlers/cursorTooltipBindingHandler');
    require('components/bindingHandlers/ratingBindingHandler');

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
                if (!/html|body/i.test($target.offsetParent()[0].tagName)) {
                    var top = event.pageY - $target.offsetParent().offset().top - (ui.helper.outerHeight(true) / 2);
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
    }

});