ko.bindingHandlers.copyToClipboard = {
    init: function () {
        if (!ZeroClipboard.config('configured')) {
            ZeroClipboard.config({ swfPath: '/Scripts/zeroclipboard.swf', configured: true });
        }
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor().value),
            onCopied = valueAccessor().onCopied,
            isDisabled = valueAccessor().isDisabled,

            clipboard = new ZeroClipboard(element);
        
        clipboard.on({
            ready: function (event) {
                event.client.on('copy', function (ev) {
                    ev.clipboardData.setData('text/plain', value);
                });

                if (_.isFunction(onCopied)) {
                    event.client.on('aftercopy', onCopied);
                }
            },
            error: function () {
                ZeroClipboard.destroy();

                $(element).one('click', function () {
                    requestToInstallFlash();

                    if (ko.isObservable(isDisabled)) {
                        isDisabled(true);
                    }
                });
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            if (clipboard) {
                clipboard.destroy();
            }
        });
    }
};

function requestToInstallFlash() {
    var flashId = 'flash_to_install';

    if ($('#' + flashId, document.body).length === 0) {
        var flashToEmbed = $('<embed width="0" height="0">').attr('id', flashId).attr('src', ZeroClipboard.config('swfPath'));
        $(document.body).append(flashToEmbed);
    }
}