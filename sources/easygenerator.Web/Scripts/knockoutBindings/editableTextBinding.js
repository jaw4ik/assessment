ko.bindingHandlers.editableText = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var
            $element = $(element),
            text = valueAccessor().text,
            onEnterKeyPress = valueAccessor().onEnterKeyPress;

        $element.text(ko.unwrap(text));
        $element.toggleClass('editable-text-binding', true);
        $element.attr('contenteditable', 'true');

        $element.on('paste', function(event) {
            var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
            pasteTextAtCaret(clipboardData.getData('text'), false);

            event.preventDefault();
            event.stopPropagation();
        }).on('keypress', function(event) {
            if (event.keyCode != 13) {
                return;
            }

            $element.blur();
            if (onEnterKeyPress) {
                onEnterKeyPress();
            }

            event.preventDefault();
            event.stopPropagation();
        }).on('drop dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
        }).on('focus', function() {
            $element.on('DOMSubtreeModified', updateValue);
        }).on('blur', function () {
            $element.scrollLeft(0);
            $element.off('DOMSubtreeModified', updateValue);
        });

        function updateValue() {
            if (ko.unwrap(text) != $element.text()) {
                text($element.text());
            }
        }

        function pasteTextAtCaret(html, selectPastedContent) {
            var sel, range;

            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)

                var el = $('<span>').text(html)[0];
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    if (selectPastedContent) {
                        range.setStartBefore(firstNode);
                    } else {
                        range.collapse(true);
                    }
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        }

        return ko.bindingHandlers.contentEditableFix.init(element, function () {
            return $element;
        });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var text = ko.unwrap(valueAccessor().text),
            $element = $(element);

        if (text != $element.text()) {
            $element.text(text);
        }
    }
};