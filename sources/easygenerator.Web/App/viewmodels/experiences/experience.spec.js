define(['viewmodels/experiences/experience'],
    function (viewModel) {

        var
            define = require('viewmodels/experiences/define'),
            design = require('viewmodels/experiences/design'),
            deliver = require('viewmodels/experiences/deliver');

        describe('viewModel [experience]', function() {

            beforeEach(function() {
                spyOn(viewModel.activeStep, 'activateItem');
            });

            it('should be an object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activeStep:', function () {

                it('should be observable', function() {
                    expect(viewModel.activeStep).toBeObservable();
                });

            });

            describe('activate:', function() {

                it('should be function', function() {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should reset active step to define', function() {
                    viewModel.activate('SomeId');
                    expect(viewModel.activeStep.activateItem).toHaveBeenCalledWith(define, 'SomeId');
                });

            });

            describe('goToDefine:', function () {

                it('should be function', function() {
                    expect(viewModel.goToDefine).toBeFunction();
                });

                it('should set activeStep to define', function() {
                    viewModel.goToDefine();
                    expect(viewModel.activeStep.activateItem).toHaveBeenCalledWith(define, jasmine.any(String));
                });

            });
            
            describe('goToDesign:', function () {

                it('should be function', function () {
                    expect(viewModel.goToDesign).toBeFunction();
                });

                it('should set activeStep to define', function () {
                    viewModel.goToDesign();
                    expect(viewModel.activeStep.activateItem).toHaveBeenCalledWith(design, jasmine.any(String));
                });

            });
            
            describe('goToDeliver:', function () {

                it('should be function', function () {
                    expect(viewModel.goToDeliver).toBeFunction();
                });

                it('should set activeStep to define', function () {
                    viewModel.goToDeliver();
                    expect(viewModel.activeStep.activateItem).toHaveBeenCalledWith(deliver, jasmine.any(String));
                });

            });

        });

    }
);