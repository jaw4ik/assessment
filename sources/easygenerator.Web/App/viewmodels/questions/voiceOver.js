define(['repositories/questionRepository', 'notify', 'dialogs/audio/audioLibrary'],
    function (repository, notify, audioLibraryDialog) {

        var voiceOverViewModel = function (questionId, voiceOverEmbed) {

            var viewModel = {
                embed: ko.observable(voiceOverEmbed),
                save: save,
                update: update,
                onAudioSelected: onAudioSelected
            };

            function save() {
                return repository.updateVoiceOver(questionId, viewModel.embed()).then(function () {
                    notify.success('Voice over saved successfully!');
                });
            }

            function update() {
                audioLibraryDialog.show(null, onAudioSelected);
            }

            function onAudioSelected(vimeoId) {
                viewModel.embed('<iframe src="//player-staging.easygenerator.com?source=' + vimeoId + '&v=1.0.0&autoplay=1" width="300" height="30" frameborder="0" title="my mega title" ></iframe>');
                viewModel.save();
            }

            return viewModel;
        };

        return voiceOverViewModel;

    });
