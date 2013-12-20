define([], function () {
    return {
        clickElementById: function (elementId) {
            var node = document.getElementById(elementId);
            if (node) {
                if (document.createEvent) {
                    var evt = document.createEvent('MouseEvents');
                    evt.initEvent('click', true, false);
                    node.dispatchEvent(evt);
                } else if (document.createEventObject) {
                    node.fireEvent('onclick');
                } else if (typeof node.onclick == 'function') {
                    node.onclick();
                }
            }
        }
    };
});