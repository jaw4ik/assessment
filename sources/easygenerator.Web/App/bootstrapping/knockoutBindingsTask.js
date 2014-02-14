define([], function () {

    return {
        execute: function () {
            ko.bindingHandlers.sortable.options = {
                opacity: 0.7, 
                placeholder: 'sortable-list-placeholder',
                containment: 'body',
                handle: '.list-item-drag-icon',
                tolerance: 'pointer',
                cursor: 'move',
                start: function(e, ui) {
                    ui.placeholder.height(ui.item.height());
                }
            };

            ko.validation.configure({
                insertMessages: false
            });
        }
    };

})