define(function (require) {
    "use strict";

    require('components/bindingHandlers/tooltipBindingHandler').install();
    require('viewmodels/questions/dragAndDrop/bindingHandlers/backgroundBindingHandler');
    require('viewmodels/questions/dragAndDrop/bindingHandlers/draggableTextBindingHandler');
    require('viewmodels/questions/fillInTheBlank/bindingHandlers/fillInTheBlankBindingHandler');
    require('viewmodels/questions/singleSelectImage/bindingHandlers/answerImageBindingHandler');
    require('widgets/imagePreview/bindingHandlers/fadeBindingHandler');
    require('widgets/imagePreview/bindingHandlers/imageLoaderBindingHandler');
    require('viewmodels/panels/bindingHandlers/fixedPanelBindingHandler');

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