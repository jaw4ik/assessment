ko.bindingHandlers.editableText = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element);

        $element.attr('contenteditable', 'true');
        $element.toggleClass('editable-text-binding', true);
        $element.text(ko.unwrap(valueAccessor()));

        $element.on('drop', function (event) {
            event.preventDefault();
            event.stopPropagation();
        }).on('paste', function (event) {
            var clipboardData = event.originalEvent.clipboardData || window.clipboardData;
            var text = clipboardData.getData('text');

            pasteTextAtCaret(text, false);

            event.preventDefault();
            event.stopPropagation();
        }).on('keypress', function (event) {
            if (event.keyCode != 13) {
                return;
            }

            $element.blur();

            event.preventDefault();
            event.stopPropagation();
        });

        var saveIntervalId = setInterval(function () {
            if (ko.unwrap(valueAccessor()) != $element.text()) {
                valueAccessor()($element.text());
            }
        }, 100);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            clearInterval(saveIntervalId);
        });

        function pasteTextAtCaret(html, selectPastedContent) {
            html = html.replace(/(\r\n|\n|\r)/gm, " ");

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

    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var text = ko.unwrap(valueAccessor());
        var $element = $(element);

        if (text != $element.text())
            $element.text(text);
    }
};