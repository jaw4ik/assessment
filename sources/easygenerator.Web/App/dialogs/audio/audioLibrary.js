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
            isLoading: ko.observable(false)
        };

        return viewModel;

        function show(selectedAudioVimeoId, callback) {
            viewModel.callback = callback;
            viewModel.isLoading(true);
            viewModel.audios.removeAll();

            getAudiosQuery.execute().then(function (audios) {
                _.each(audios, function (audio) {
                    var vmAudio = new AudioViewModel(audio);
                    viewModel.audios.push(new AudioViewModel(audio));
                    if (selectedAudioVimeoId && vmAudio.vimeoId === selectedAudioVimeoId) {
                        viewModel.selectedAudio(vmAudio);
                    }
                });

                viewModel.isLoading(false);
            });

            dialog.show(viewModel, constants.dialogs.audioLibrary.settings);
        }

        function submit() {
            dialog.close();

            if (_.isFunction(viewModel.callback)) {
                viewModel.callback(viewModel.selectedAudio());
            }
        }

        function selectAudio(audio) {
            viewModel.selectedAudio(audio);
        }
    });