ko.bindingHandlers.contentEditableFix = {
    init: function(element) {
        var $element = $(element),
            $editableFix = $('<input type="text" style="width:0;height:0;margin:0;padding:0;border:none;" />').appendTo('body');

        $element.blur(function () {
            $editableFix.focus();
            $editableFix[0].setSelectionRange(0, 0);
            $editableFix.blur();
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $editableFix.remove();
        });
    },
};