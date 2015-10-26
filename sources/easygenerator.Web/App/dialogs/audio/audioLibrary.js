define(['constants', 'widgets/dialog/viewmodel', 'audio/queries/getCollection', 'dialogs/audio/audioViewModel', 'plugins/router', 'eventTracker'],
    function (constants, dialog, getAudiosQuery, AudioViewModel, router, eventTracker) {
        "use strict";

        var events = {
            navigateToAudioLibrary: 'Navigate to audio library'
        };

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
            navigateToAudioLibrary: navigateToAudioLibrary,
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
                    var vmAudio = new AudioViewModel(audio);
                    viewModel.audios.push(vmAudio);
                    if (selectedAudioVimeoId && vmAudio.vimeoId === selectedAudioVimeoId) {
                        viewModel.selectedAudio(vmAudio);
                    }
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

        function navigateToAudioLibrary() {
            eventTracker.publish(events.navigateToAudioLibrary);
            dialog.close();
            router.navigate('library/audios');
        }

        function close() {
            dialog.close();
        }
    });