define(['repositories/questionRepository', 'notify'],
    function (repository, notify) {

        var voiceOverViewModel = function (questionId, voiceOverEmbed) {

            var viewModel = {
                embed: ko.observable(voiceOverEmbed),
                update: update
            };

            function update() {
                return repository.updateVoiceOver(questionId, viewModel.embed()).then(function () {
                    notify.success('Voice over saved successfully!');
                });
            }

            return viewModel;
        };

        return voiceOverViewModel;

    });
