define(['localization/localizationManager', 'repositories/helpHintRepository'], function (localizationManager, helpHintRepository) {

    var viewModel = {
        id: '',
        key: '',
        title: ko.observable(),
        text: ko.observable(),
        visible: ko.observable(true),
        isEmptyHint: ko.observable(false),
        show: show,
        close: close,
        isRequestPending: false,
        activate: activate,
    };

    viewModel.visible = ko.computed(function () {
        return viewModel.title() || viewModel.text();
    });

    return viewModel;

    function show() {

        if (viewModel.id || viewModel.isRequestPending || viewModel.isEmptyHint()) {
            return;
        }

        viewModel.isRequestPending = true;

        helpHintRepository.addHint(viewModel.key).then(function (hint) {
            viewModel.id = hint.id;
            viewModel.title(localizationManager.localize(hint.localizationKey + 'Title'));
            viewModel.text(localizationManager.localize(hint.localizationKey));
            viewModel.isRequestPending = false;
        });
    }

    function close() {

        if (viewModel.isRequestPending || !viewModel.id) {
            return;
        }

        viewModel.isRequestPending = true;
        helpHintRepository.removeHint(viewModel.id).then(function () {
            viewModel.id = '';
            viewModel.title('');
            viewModel.text('');
            viewModel.isRequestPending = false;
        });
    }

    function activate(key) {

        viewModel.key = key;
        
        viewModel.id = '';
        viewModel.title('');
        viewModel.text('');
        viewModel.isEmptyHint(false);

        return helpHintRepository.getHint(key).then(function(hint) {
            if (_.isNullOrUndefined(hint)) {
                return;
            }

            if (localizationManager.hasKey(hint.localizationKey)) {
                viewModel.id = hint.id;
                viewModel.title(localizationManager.localize(hint.localizationKey + 'Title'));
                viewModel.text(localizationManager.localize(hint.localizationKey));
            } else {
                viewModel.isEmptyHint(true);
            }
        });

    }

})