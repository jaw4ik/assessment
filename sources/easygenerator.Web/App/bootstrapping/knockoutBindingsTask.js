define([], function () {

    return {
        execute: function () {
            ko.bindingHandlers.sortable.options = {
                opacity: 0.7,
                placeholder: 'sortable-list-placeholder',
                forcePlaceholderSize: true,
                containment: 'body',
                handle: '.list-item-drag-icon',
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
    };

})