ko.bindingHandlers.autofocus = {
    update: function (element, valueAccessor) {
        var focus = ko.unwrap(valueAccessor().focus),
            autoselect = ko.unwrap(valueAccessor().autoselect) || false;

        setTimeout(function () {
            if (focus) {
                setFocusToEndOfText(element);
            }

            if (autoselect) {
                selectElement(element);
                $(element).blur(onBlur);
            }
        }, 0);

        function setFocusToEndOfText(elementNode) {
            elementNode.focus();
            if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(elementNode);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(elementNode);
                textRange.collapse(false);
                textRange.select();
            }
        }

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
    }
};