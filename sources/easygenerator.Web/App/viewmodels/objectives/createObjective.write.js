define(['repositories/objectiveRepository', 'plugins/router', 'eventTracker', 'constants', 'uiLocker'],
    function (objectiveRepository, router, eventTracker, constants, uiLocker) {
        "use strict";

        var
            events = {
                createAndContinue: "Create learning objective and open it properties"
            };

        var viewModel = {
            title: ko.observable(''),
            isTitleEditing: ko.observable(false),
            objectiveTitleMaxLength: constants.validation.objectiveTitleMaxLength,

            initialize: initialize,

            createAndContinue: createAndContinue
        };

        viewModel.title.isValid = ko.computed(function () {
            var length = viewModel.title().trim().length;
            return length > 0 && length <= constants.validation.objectiveTitleMaxLength;
        });

        return viewModel;

        function initialize() {
            viewModel.title('');
        }

        function createAndContinue() {
            eventTracker.publish(events.createAndContinue);

            viewModel.title(viewModel.title().trim());
            if (!viewModel.title.isValid()) {
                return Q.fcall(function () { });
            }

            uiLocker.lock();

            return objectiveRepository.addObjective({ title: viewModel.title() }).then(function (createdObjective) {
                uiLocker.unlock();
                router.navigate('objective/' + createdObjective.id);
            }).fail(function () {
                uiLocker.unlock();
            });
        }

    }
);