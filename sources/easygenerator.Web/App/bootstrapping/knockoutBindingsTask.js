define(function (require) {
    "use strict";

    require('components/bindingHandlers/tooltipBindingHandler').install();
    require('components/bindingHandlers/backgroundBindingHandler');
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
            start: function(e, ui) {
                if (/MSIE/i.test(navigator.userAgent)) {
                    ui.placeholder.height(ui.item.height());
                }
            }
        };

        ko.validation.configure({
            insertMessages: false
        });
    }

});