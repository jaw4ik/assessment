define(['durandal/activator', 'viewmodels/experiences/define', 'viewmodels/experiences/design', 'viewmodels/experiences/deliver', 'clientContext', 'durandal/app', 'notify', 'constants'],
    function (activator, define, design, deliver, clientContext, app, notify, constants) {


        var viewModel = {
            id: '',
            activeStep: activator.create(),

            steps: [define, design, deliver],

            goToDefine: goToDefine,
            goToDesign: goToDesign,
            goToDeliver: goToDeliver,

            activate: activate,
            deactivate: deactivate
        };


        function goToDefine() {
            return viewModel.activeStep.activateItem(define, viewModel.id);
        }

        function goToDesign() {
            return viewModel.activeStep.activateItem(design, viewModel.id);
        }

        function goToDeliver() {
            return viewModel.activeStep.activateItem(deliver, viewModel.id);
        }

        function activate(experienceId) {
            return Q.fcall(function () {
                viewModel.activeStep.activateItem({});
                viewModel.id = experienceId;
                return viewModel.goToDefine().then(function () {
                    clientContext.set('lastVistedExperience', experienceId);
                    clientContext.set('lastVisitedObjective', null);
                });
            });
        }

        function deactivate() {
            return Q.fcall(function () {
                viewModel.id = '';
            });
        }

        function notifyError(experienceId, message) {
            if (experienceId == viewModel.id && !_.isNullOrUndefined(message)) {
                notify.error(message);
            }
        }

        app.on(constants.messages.experience.build.failed, notifyError);
        app.on(constants.messages.experience.publish.failed, notifyError);

        return viewModel;
    }
);