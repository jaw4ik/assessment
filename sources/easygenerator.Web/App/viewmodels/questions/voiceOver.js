define(['guard', 'repositories/questionRepository', 'notify', 'dialogs/audio/audioLibrary', 'constants', 'eventTracker'],
    function (guard, repository, notify, audioLibraryDialog, constants, eventTracker) {

        var events = {
            chooseVoiceOverFromAudioLibrary: 'Open \'Choose voice over from audio library\' dialog',
            addVoiceOver: 'Add voice over',
            changeVoiceOver: 'Change voice over',
            deleteVoiceOver: 'Delete voice over'
        };

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
                eventTracker.publish(events.chooseVoiceOverFromAudioLibrary);
                audioLibraryDialog.show(null, onAudioSelected);
            }

            function remove() {
                eventTracker.publish(events.deleteVoiceOver);
                return repository.updateVoiceOver(questionId, null).then(function () {
                    viewModel.title(null);
                    notify.saved();
                }).catch(function (s) {
                    debugger;
                });
            }

            function onAudioSelected(audio) {
                eventTracker.publish(viewModel.title() ? events.changeVoiceOver : events.addVoiceOver);
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
