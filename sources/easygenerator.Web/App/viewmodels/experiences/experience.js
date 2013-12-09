define(['plugins/router', 'durandal/activator', 'eventTracker', 'localization/localizationManager', 'viewmodels/experiences/define', 'viewmodels/experiences/design', 'viewmodels/experiences/deliver', 'clientContext', 'durandal/app', 'notify', 'constants'],
    function (router, activator, eventTracker, localizationManager, define, design, deliver, clientContext, app, notify, constants) {

        var
            goBackTooltip = '',
            events = {
                navigateToExperiences: 'Navigate to experiences',
            };

        var activatorSettings = {
            areSameItem: function(currentItem, newItem, currentId, newId ) {
                return currentItem == newItem && currentId == newId;
            }
        };

        var viewModel = {
            id: '',
            activeStep: activator.create({}, activatorSettings),

            steps: [define, design, deliver],
            goToDefine: goToDefine,
            goToDesign: goToDesign,
            goToDeliver: goToDeliver,
            
            goBackTooltip: goBackTooltip,
            navigateToExperiences: navigateToExperiences,

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

        function navigateToExperiences() {
            eventTracker.publish(events.navigateToExperiences);
            router.navigate('experiences');
        }

        function activate(experienceId) {
            return Q.fcall(function () {
                viewModel.id = experienceId;
                viewModel.goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('experiences');

                return viewModel.goToDefine().then(function (result) {
                    var deferred = Q.defer();

                    if (result) {
                        clientContext.set('lastVistedExperience', experienceId);
                        clientContext.set('lastVisitedObjective', null);

                        deferred.resolve();
                    } else {
                        deferred.reject("Define step was not activated");
                    }
                    return deferred.promise;
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