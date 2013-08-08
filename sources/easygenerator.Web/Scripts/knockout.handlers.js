ko.bindingHandlers.autoResize = {
    init: function (element, valueAccessor) {
        if (valueAccessor() == true)
            setTimeout(function() { $(element).autosize(); }, 70);
    }
};