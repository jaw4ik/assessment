import ko from 'knockout';
import $ from 'jquery';

ko.bindingHandlers.editableText = {
    init: (element, valueAccessor) => {
        let $element = $(element);
        let text = valueAccessor().text;
        let onEnterKeyPress = valueAccessor().onEnterKeyPress;
        let updateValue = () => {
            if (ko.utils.unwrapObservable(text) !== $element.text()) {
                text($element.text());
            }
        };
        let pasteTextAtCaret = (html, selectPastedContent) => {
            let sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                let range;
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
        };

        $element.text(ko.utils.unwrapObservable(text));
        $element.toggleClass('editable-text-binding', true);
        $element.attr('contenteditable', true);

        $element.on('paste', event => {
            let clipboardData = event.originalEvent.clipboardData || window.clipboardData;
            pasteTextAtCaret(clipboardData.getData('text'), false);

            event.preventDefault();
            event.stopPropagation();
        }).on('keypress', event => {
            if (event.keyCode !== 13) {
                return;
            }
            $element.blur();

            if (onEnterKeyPress) {
                onEnterKeyPress();
            }

            event.preventDefault();
            event.stopPropagation();
        }).on('drop dragover', event => {
            event.preventDefault();
            event.stopPropagation();
        }).on('focus', () => {
            $element.on('DOMSubtreeModified', updateValue);
        }).on('blur', () => {
            $element.scrollLeft(0);
            $element.off('DOMSubtreeModified', updateValue);
        });

        return ko.bindingHandlers.contentEditableFix.init(element, function () {
            return $element;
        });
    },
    update: (element, valueAccessor) => {
        let text = ko.utils.unwrapObservable(valueAccessor().text);
        let $element = $(element);
        
        if (text !== $element.text()) {
            $element.text(text);
        }

        if ($element.text().length === 0) {
            $element.text('');
        }
    }
};