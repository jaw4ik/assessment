import ko from 'knockout';

ko.bindingHandlers.keyDown = {
    init:(element, valueAccessor) => {
        let value = valueAccessor();
        let handlers = value.handlers;

        $(element).attr("tabindex", "1");
        $(element).focus();

        $(element).bind('keydown', function(event) {
            if (_.isFunction(handlers[event.keyCode])) {
                handlers[event.keyCode]();
            }

            event.preventDefault();
            event.stopPropagation();
        });
    }
}