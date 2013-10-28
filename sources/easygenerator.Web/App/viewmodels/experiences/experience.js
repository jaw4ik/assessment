define(['durandal/activator', 'viewmodels/experiences/define', 'viewmodels/experiences/design', 'viewmodels/experiences/deliver', 'clientContext'],
    function (activator, define, design, deliver, clientContext) {


        var
            activeStep = activator.create(),

            id = null,

            goToDefine = function () {
                activeStep.activateItem(define, id);
            },

            goToDesign = function () {
                activeStep.activateItem(design, id);
            },

            goToDeliver = function () {
                activeStep.activateItem(deliver, id);
            },

            activate = function (experienceId) {
                activeStep.activateItem({});
                id = experienceId;
                goToDefine();

                clientContext.set('lastVistedExperience', experienceId);
                clientContext.set('lastVisitedObjective', null);
            }
        ;

        return {
            activeStep: activeStep,
            steps: [define, design, deliver],

            goToDefine: goToDefine,
            goToDesign: goToDesign,
            goToDeliver: goToDeliver,

            activate: activate
        };

    }
);