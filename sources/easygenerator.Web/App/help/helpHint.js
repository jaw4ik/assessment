define(['localization/localizationManager'], function (localizationManager) {
    "use strict";

    var viewModel = {
        title: ko.observable(),
        text: ko.observable(),
        visible: ko.observable(false),
        isHelpHintExist: ko.observable(false),

        show: show,
        close: close,
        activate: activate
    };

    return viewModel;

    function show() {
        if (viewModel.isHelpHintExist()) {
            viewModel.visible(true);
        }
    }

    function close() {
        if (viewModel.isHelpHintExist()) {
            viewModel.visible(false);
        }
    }

    function activate(key) {
        viewModel.visible(false);
        viewModel.isHelpHintExist(getHelpHintExistence(key));

        if (viewModel.isHelpHintExist()) {
            viewModel.title(getTitle(key));
            viewModel.text(getDescription(key));
        }
    }

    function getTitle(key) {
        return localizationManager.localize(key + 'HelpHintTitle');
    }

    function getDescription(key) {
        return localizationManager.localize(key + 'HelpHint');
    }

    function getHelpHintExistence(key) {
        return localizationManager.hasKey(key + 'HelpHintTitle') && localizationManager.hasKey(key + 'HelpHint');
    }

});