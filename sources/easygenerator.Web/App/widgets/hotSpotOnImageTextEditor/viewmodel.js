define(['widgets/hotSpotOnImageTextEditor/bindingHadlers/hotspotOnImageTextEditorBindingHandler'], function (hotspotOnImageTextEditorBindingHandler) {
    "use strict";

    var hotSpotOnImageTextEditor = {
        top: ko.observable(''),
        left: ko.observable(''),
        close: close,
        save: save,
        show: show,
        isVisible: ko.observable(false),
        text: ko.observable(''),
        activate: activate,
        callback: null,
    };

    return hotSpotOnImageTextEditor;

    function activate() {
        hotspotOnImageTextEditorBindingHandler.install();
    }

    function close() {
        hotSpotOnImageTextEditor.isVisible(false);
    }

    function show(text, top, left, callback) {
        hotSpotOnImageTextEditor.isVisible(true);
        hotSpotOnImageTextEditor.text(text);
        hotSpotOnImageTextEditor.top(top - 28);
        hotSpotOnImageTextEditor.left(left + 6);
        hotSpotOnImageTextEditor.callback = callback;
    }

    function save() {
        hotSpotOnImageTextEditor.callback(hotSpotOnImageTextEditor.text());
        hotSpotOnImageTextEditor.isVisible(false);
    }
});