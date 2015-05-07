ko.bindingHandlers.autofocus = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here

        var focus = ko.unwrap(valueAccessor().focus),
            autoselect = ko.unwrap(valueAccessor().autoselect) || false;

        setTimeout(function () {
            if (focus) {
                $(element).focus();
            }

            if (autoselect) {
                selectElement(element);
                $(element).blur(onBlur);
            }
        }, 0);

        function onBlur() {
            clearSelection();
            $(element).off('blur', onBlur);
        }

        function clearSelection() {
            if (window.getSelection) {
                if (window.getSelection().empty) {
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {
                document.selection.empty();
            }
        }

        function selectElement(elem) {
            var doc = window.document, sel, range;
            if (window.getSelection && doc.createRange) {
                sel = window.getSelection();
                range = doc.createRange();
                range.selectNodeContents(elem);
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (doc.body.createTextRange) {
                range = doc.body.createTextRange();
                range.moveToElementText(elem);
                range.select();
            }
        }
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
    }
};