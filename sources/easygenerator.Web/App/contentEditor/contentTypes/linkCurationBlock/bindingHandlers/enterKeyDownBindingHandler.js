import ko from 'knockout';

ko.bindingHandlers.enterKeyDownBindingHandler = { 
    update: (element, valueAccessor) => {
        ko.applyBindingsToNode(element, {
            event: {
                keypress: (data, event) => {
                    var value = ko.unwrap(valueAccessor());
                    var keyCode = (event.which ? event.which : event.keyCode);
                    if (event.keyCode === 13) { 
                        value();
                        event.stopPropagation();
                        event.preventDefault(); 
                        return false; 
                    };
                    return true;
                }   
            }
        });
    }
};