define(['constants', 'widgets/dialog/viewmodel', 'audio/queries/getCollection', 'dialogs/audio/audioViewModel'],
    function (constants, dialog, getAudiosQuery, AudioViewModel) {
        "use strict";

        var viewModel = {
            show: show,
            callback: null,
            selectedAudio: ko.observable(null),
            selectAudio: selectAudio,
            audios: ko.observableArray([]),
            submit: submit,
            isLoading: ko.observable(false),
            isValidationMessageShown: ko.observable(false),
            hideValidationMessage: hideValidationMessage,
            close: close
        };

        return viewModel;

        function show(selectedAudioVimeoId, callback) {
            viewModel.isValidationMessageShown(false);
            viewModel.callback = callback;
            viewModel.selectedAudio(null);
            viewModel.isLoading(true);
            viewModel.audios.removeAll();

            getAudiosQuery.execute().then(function (audios) {
                _.each(audios, function (audio) {
                    //var vmAudio = new AudioViewModel(audio);
                    //viewModel.audios.push(vmAudio);
                    //if (selectedAudioVimeoId && vmAudio.vimeoId === selectedAudioVimeoId) {
                    //    viewModel.selectedAudio(vmAudio);
                    //}
                });

                viewModel.isLoading(false);
            });

            dialog.show(viewModel, constants.dialogs.audioLibrary.settings);
        }

        function submit() {
            if (!viewModel.selectedAudio()) {
                viewModel.isValidationMessageShown(true);
                return;
            }

            dialog.close();

            if (_.isFunction(viewModel.callback)) {
                viewModel.callback(viewModel.selectedAudio());
            }
        }

        function selectAudio(audio) {
            viewModel.selectedAudio(audio);
            if (audio) {
                viewModel.isValidationMessageShown(false);
                return;
            }
        }

        function hideValidationMessage() {
            viewModel.isValidationMessageShown(false);
        }

        function close() {
            dialog.close();
        }
    });