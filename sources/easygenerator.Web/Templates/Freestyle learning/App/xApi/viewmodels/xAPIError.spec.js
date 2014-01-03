define(function(require) {
    "use strict";

    var viewModel = require('./xAPIError'),
        router = require('plugins/router');

    describe('viewModel [xAPIError]', function () {
        
        beforeEach(function () {
            spyOn(router, 'navigate');
        });

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function() {

            it('should be defined', function() {
                expect(viewModel.activate).toBeDefined();
            });

            it('should be function', function() {
                expect(viewModel.activate).toBeFunction();
            });

        });

        describe('continueLearning:', function () {

            it('should be defined', function() {
                expect(viewModel.continueLearning).toBeDefined();
            });

            it('should be function', function() {
                expect(viewModel.continueLearning).toBeFunction();
            });

            it('should navigate to backUrl', function () {
                var backUrl = 'backUrl';
                viewModel.activate(backUrl);
                viewModel.continueLearning();
                expect(router.navigate).toHaveBeenCalledWith(backUrl);
            });

        });

        describe('restartCourse:', function () {

            it('should be defined', function() {
                expect(viewModel.restartCourse).toBeDefined();
            });

            it('should be function', function() {
                expect(viewModel.restartCourse).toBeFunction();
            });

        });
    });
})