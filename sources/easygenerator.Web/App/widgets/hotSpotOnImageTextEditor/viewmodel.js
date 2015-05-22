define(['widgets/hotSpotOnImageTextEditor/bindingHadlers/hotspotOnImageTextEditorBindingHandler'], function (hotspotOnImageTextEditorBindingHandler) {
    "use strict";

    var hotSpotOnImageTextEditor = {
        top: ko.observable(''),
        left: ko.observable(''),
        wrapper: ko.observable(null),
        points: ko.observable(null),
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

    function show(text, wrapper, points, callback) {
        hotSpotOnImageTextEditor.text(text);
        hotSpotOnImageTextEditor.wrapper(wrapper);
        hotSpotOnImageTextEditor.points(points);
        hotSpotOnImageTextEditor.callback = callback;
        hotSpotOnImageTextEditor.isVisible(true);
        /*hotSpotOnImageTextEditor.top(top - 28);
        hotSpotOnImageTextEditor.left(left + 6);*/
    }

    function save() {
        if (_.isFunction(hotSpotOnImageTextEditor.callback)) {
            hotSpotOnImageTextEditor.callback(hotSpotOnImageTextEditor.text());
        }
        hotSpotOnImageTextEditor.isVisible(false);
    }
});