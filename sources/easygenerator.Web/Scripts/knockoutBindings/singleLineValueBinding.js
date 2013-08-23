ko.bindingHandlers.singleLineValue = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.unwrap(valueAccessor());
        valueAccessor()(filterValue(value));
        
        ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor, viewModel);

        var onKeyPress = function (e) {
            if (e.keyCode != 13)
                return;

            try {
                $elem.blur();
            } finally {
                event.preventDefault();
                event.returnValue = false;
            }
        };

        var onDragDrop = function(e) {
            e.preventDefault();
            e.stopPropagation();

            event.returnValue = false;
            
            return false;
        };

        var $elem = $(element);
        $elem.bind('keypress', onKeyPress);
        $elem.bind('dragover', onDragDrop);
        $elem.bind('drop', onDragDrop);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $elem.unbind('keypress', onKeyPress);
            $elem.unbind('dragover', onDragDrop);
            $elem.unbind('drop', onDragDrop);
        });
    },
    
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = ko.unwrap(valueAccessor());
        valueAccessor()(filterValue(value));
        
        ko.bindingHandlers.value.update(element, valueAccessor, allBindingsAccessor, viewModel);
    }
};

function filterValue(str) {
    return str.replace(/(\r\n|\n|\r)/gm, " ");
}

