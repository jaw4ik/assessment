ko.bindingHandlers.hover = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var hover = valueAccessor();

        $(element).on('mouseover', function() {
            hover(true);
        });
        
        $(element).on('mouseout', function () {
            hover(false);
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            hover(false);
            $(element).off('mouseover mouseout');
        });
    }
};