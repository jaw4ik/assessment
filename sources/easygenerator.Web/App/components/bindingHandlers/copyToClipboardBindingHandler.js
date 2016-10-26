import ko from 'knockout';
import _ from 'underscore';
import notify from 'notify';
import Clipboard from 'clipboard';

ko.bindingHandlers.copyToClipboard = {
    init: (element, valueAccessor) => {
        var value = ko.unwrap(valueAccessor().value),
            onCopied = valueAccessor().onCopied,
            isDisabled = valueAccessor().isDisabled; // not used now, but should be used when clipboard.js implemented events to check browser compatibility

        let clipboard = new Clipboard(element, {
            text: () => value
        });

        clipboard.on('success', () => {
            if (_.isFunction(onCopied)) {
                onCopied();
            }
        });

        clipboard.on('error', () => notify.error());

        ko.utils.domNodeDisposal.addDisposeCallback(element, () => clipboard.destroy());
    }
};