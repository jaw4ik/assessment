define(['durandal/activator', 'viewmodels/experiences/define', 'viewmodels/experiences/design', 'viewmodels/experiences/deliver', 'clientContext'],
    function (activator, define, design, deliver, clientContext) {


        var
            activeStep = activator.create(),

            id = null,

            goToDefine = function () {
                activeStep.activateItem(define, this.id);
            },

            goToDesign = function () {
                activeStep.activateItem(design, this.id);
            },

            goToDeliver = function () {
                activeStep.activateItem(deliver, this.id);
            },

            activate = function (experienceId) {
                var that = this;

                return Q.fcall(function() {
                    activeStep.activateItem({});
                    that.id = experienceId;
                    goToDefine.call(that);

                    clientContext.set('lastVistedExperience', experienceId);
                    clientContext.set('lastVisitedObjective', null);
                });
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