define(['guard', 'repositories/questionRepository', 'notify', 'dialogs/audio/chooseVoiceOver', 'constants', 'eventTracker', 'durandal/app'],
    function (guard, repository, notify, chooseVoiceOverDialog, constants, eventTracker, app) {

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

            function getVimeoId(embed) {
                return embed ? $('<div/>').html(embed).find('iframe').attr('audioId') : null;
            }

            function getEmbedCode(vimeoId, title) {
                var embedCode = '<iframe src="{playerUrl}?source={vimeoId}&v=1.0.0&autoplay=1" width="300" height="30" frameborder="0" title="{title}" audioId="{vimeoId}"></iframe>';

                return embedCode.replace(/{vimeoId}/g, vimeoId)
                    .replace('{title}', title)
                    .replace('{playerUrl}', constants.player.host);
            }

            var viewModel = {
                title: ko.observable(getTitle(voiceOverEmbed)),
                vimeoId: getVimeoId(voiceOverEmbed),
                update: update,
                onAudioSelected: onAudioSelected,

                remove: remove,

                getEmbedCode: getEmbedCode,
                getTitle: getTitle,
                getVimeoId: getVimeoId,
                voiceOverUpdatedByCollaborator: voiceOverUpdatedByCollaborator
            };

            app.on(constants.messages.question.voiceOverUpdatedByCollaborator + questionId, viewModel.voiceOverUpdatedByCollaborator);

            function update() {
                eventTracker.publish(events.chooseVoiceOverFromAudioLibrary);
                chooseVoiceOverDialog.show(viewModel.vimeoId, viewModel.onAudioSelected);
            }

            function remove() {
                eventTracker.publish(events.deleteVoiceOver);
                return repository.updateVoiceOver(questionId, null).then(function () {
                    viewModel.vimeoId = null;
                    viewModel.title(null);
                    notify.saved();
                });
            }

            function onAudioSelected(audio) {
                eventTracker.publish(viewModel.vimeoId ? events.changeVoiceOver : events.addVoiceOver);
                guard.throwIfNotAnObject(audio, 'Audio is not an object');
                guard.throwIfNotString(audio.vimeoId, 'VimeoId is not a string');
                guard.throwIfNotString(audio.title, 'Title is not a string');

                viewModel.title(audio.title);
                viewModel.vimeoId = audio.vimeoId;

                return repository.updateVoiceOver(questionId, viewModel.getEmbedCode(audio.vimeoId, audio.title)).then(function () {
                    notify.saved();
                });
        }

            function voiceOverUpdatedByCollaborator(voiceOver) {
                viewModel.title(getTitle(voiceOver));
                viewModel.vimeoId = getVimeoId(voiceOver);
        }

            return viewModel;
    };

        return voiceOverViewModel;

});
