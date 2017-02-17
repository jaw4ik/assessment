import ko from 'knockout';
import _ from 'underscore';
import $ from 'jquery';

ko.bindingHandlers.keyDown = {
    init:(element, valueAccessor) => {
        let value = valueAccessor();
        let handlers = value.handlers;
        let bubbling = value.bubbling;

        $(element).attr('tabindex', '1');
        $(element).focus();

        $(element).bind('keydown', function(event) {
            if (_.isFunction(handlers[event.keyCode])) {
                handlers[event.keyCode]();
            }

            if(!bubbling){
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }
}