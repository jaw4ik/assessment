﻿define(['widgets/hotSpotOnImageTextEditor/bindingHadlers/hotspotOnImageTextEditorBindingHandler', 'viewmodels/learningContents/components/hotspotParser'], function (hotspotOnImageTextEditorBindingHandler, parser) {
    "use strict";

    var hotSpotOnImageTextEditor = {
        wrapper: ko.observable(null),
        points: ko.observable(null),
        close: close,
        save: save,
        show: show,
        saveAndClose: saveAndClose,
        isVisible: ko.observable(false),
        text: ko.observable(''),
        hasFocus: ko.observable(false),
        activate: activate,
        callback: null,
    };

    return hotSpotOnImageTextEditor;

    function activate() {
        hotspotOnImageTextEditorBindingHandler.install(parser);
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
    }

    function save() {
        if (_.isFunction(hotSpotOnImageTextEditor.callback)) {
            hotSpotOnImageTextEditor.callback(hotSpotOnImageTextEditor.text());
        }
    }

    function saveAndClose() {
        hotSpotOnImageTextEditor.save();
        hotSpotOnImageTextEditor.close();
    }
});