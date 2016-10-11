import ko from 'knockout';

ko.bindingHandlers.stopPropagation = {
    init: element => {
        element.addEventListener('click', (evt) => {
            evt.stopPropagation(); 
        });
    }
};