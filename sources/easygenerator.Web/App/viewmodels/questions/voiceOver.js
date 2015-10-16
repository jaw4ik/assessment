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

            }

            return viewModel;
        };

        return voiceOverViewModel;

    });
