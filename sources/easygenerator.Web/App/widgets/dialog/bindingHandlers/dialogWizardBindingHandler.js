﻿ko.bindingHandlers.dialogWizard = {
    init: function (element) {
        var $element = $(element),
            stepClassSelector = '.dialog-wizard-step';

        $element.find(stepClassSelector).each(function () {
            $(this).hide();
        });
    },
    update: function (element, valueAccessor) {
        var $element = $(element),
            activeStepViewModel = ko.unwrap(valueAccessor().activeStep),
            stepClassSelector = '.dialog-wizard-step',
            $currentStep = $element.find(stepClassSelector + '.active'),
            $currentStepDialogBody = $currentStep.find('.dialog-body').height('100%'),
            $targetStep = getTargetStep();

        if (!$targetStep) {
            return;
        }

        navigate();

        function getTargetStep() {
            var step;
            $element.find(stepClassSelector).each(function () {
                var $step = $(this);
                var context = ko.contextFor($step[0]).$data;
                if (context === activeStepViewModel) {
                    step = $step;
                    return;
                }
            });

            return step;
        }

        function navigate() {
            if (!$currentStep || $currentStep.length === 0) {
                $targetStep.show();
                setFocus();
                return;
            }

            var targetHeight = $targetStep.outerHeight(),
                currentHeight = $currentStep.outerHeight();

            $element.height(currentHeight);

            $currentStep.height('100%');
            $targetStep.height('100%');
            $currentStepDialogBody.height('100%');

            $element.animate({ height: targetHeight }, 200, function () {
                $targetStep.height('auto');
                $element.removeAttr('style');
            });

            $currentStep.fadeOut(100, function () {
                $currentStep.height('auto');
                $targetStep.fadeIn(100, function () {
                    $currentStepDialogBody.height('auto');
                    setFocus();
                });
            });
        }

        function setFocus() {
            _.defer(function () {
                $element.find('.autofocus').focus();
            });
        }
    }
};