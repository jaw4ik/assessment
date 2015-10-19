define(['guard', 'repositories/questionRepository', 'notify', 'dialogs/audio/audioLibrary', 'constants'],
    function (guard, repository, notify, audioLibraryDialog, constants) {

        var voiceOverViewModel = function (questionId, voiceOverEmbed) {

            function getTitle(embed) {
                return embed ? $('<div/>').html(embed).find('iframe').attr('title') : null;
            }

            function getEmbedCode(vimeoId, title) {
                var embedCode = '<iframe src="{playerUrl}?source={vimeoId}&v=1.0.0&autoplay=1" width="300" height="30" frameborder="0" title="{title}"></iframe>';

                return embedCode.replace('{vimeoId}', vimeoId)
                    .replace('{title}', title)
                    .replace('{playerUrl}', constants.player.host);
            }

            var viewModel = {
                title: ko.observable(getTitle(voiceOverEmbed)),
                update: update,
                onAudioSelected: onAudioSelected,

                remove: remove,

                getEmbedCode: getEmbedCode,
                getTitle: getTitle
            };

            function update() {
                audioLibraryDialog.show(null, onAudioSelected);
            }

            function remove() {
                return repository.updateVoiceOver(questionId, null).then(function () {
                    viewModel.title(null);
                    notify.saved();
                }).catch(function(s) {
                    debugger;
                });
            }

            function onAudioSelected(audio) {
                guard.throwIfNotAnObject(audio, 'Audio is not an object');
                guard.throwIfNotString(audio.vimeoId, 'VimeoId is not a string');
                guard.throwIfNotString(audio.title, 'Title is not a string');

                viewModel.title(audio.title);

                return repository.updateVoiceOver(questionId, viewModel.getEmbedCode(audio.vimeoId, audio.title)).then(function () {
                    notify.saved();
                });
            }

            return viewModel;
        };

        return voiceOverViewModel;

    });
