define(['plugins/router', 'durandal/activator', 'eventTracker', 'localization/localizationManager', 'viewmodels/courses/define', 'viewmodels/courses/design', 'viewmodels/courses/deliver', 'clientContext', 'durandal/app', 'notify', 'constants'],
    function (router, activator, eventTracker, localizationManager, define, design, deliver, clientContext, app, notify, constants) {

        var
            goBackTooltip = '',
            events = {
                navigateToCourses: 'Navigate to courses',
            };

        var viewModel = {
            id: '',
            activeStep: activator.create(),

            steps: [define, design, deliver],
            goToDefine: goToDefine,
            goToDesign: goToDesign,
            goToDeliver: goToDeliver,
            
            goBackTooltip: goBackTooltip,
            navigateToCourses: navigateToCourses,

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

        function navigateToCourses() {
            eventTracker.publish(events.navigateToCourses);
            router.navigate('courses');
        }

        function activate(courseId) {
            return Q.fcall(function () {
                viewModel.id = courseId;
                viewModel.goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('courses');

                return viewModel.goToDefine().then(function (result) {
                    var deferred = Q.defer();

                    if (result) {
                        clientContext.set('lastVistedCourse', courseId);
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
                var currentStep = _.find(viewModel.steps, function (step) {
                    return step == viewModel.activeStep();
                });
                viewModel.activeStep.deactivate(currentStep, true);
            });
        }

        function notifyError(courseId, message) {
            if (courseId == viewModel.id && !_.isNullOrUndefined(message)) {
                notify.error(message);
            }
        }

        app.on(constants.messages.course.build.failed, notifyError);
        app.on(constants.messages.course.publish.failed, notifyError);

        return viewModel;
    }
);